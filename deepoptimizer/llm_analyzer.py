"""
Gemini LLM integration for advanced ML code analysis.
"""
import os
import json
import re
from typing import List, Dict, Any, Optional
from pathlib import Path
import google.generativeai as genai

from .prompts import PromptBuilder
from .knowledge_base import KnowledgeBase

# Try to load .env file if it exists
try:
    from dotenv import load_dotenv
    # Look for .env in current directory and parent directories
    for path in ['.', '..', '../..']:
        env_path = Path(path) / '.env'
        if env_path.exists():
            load_dotenv(env_path)
            break
except ImportError:
    # dotenv not installed, rely on environment variables
    pass


class GeminiAnalyzer:
    """Analyzes ML code using Gemini API with context-aware prompting."""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize Gemini client with API key."""
        self.api_key = api_key or os.environ.get('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("Gemini API key required. Set GEMINI_API_KEY environment variable or pass api_key parameter.")
        
        genai.configure(api_key=self.api_key)
        self.knowledge_base = KnowledgeBase()
        self.prompt_builder = PromptBuilder(self.knowledge_base)
    
    def analyze(self, code: str, file_path: str = None, project_context: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Analyze code for ML-specific issues using Gemini.
        
        Args:
            code: Python code to analyze
            file_path: Path to the file being analyzed
            project_context: Additional context (framework, hardware, etc.)
            
        Returns:
            List of detected issues with severity, suggestions, etc.
        """
        # Build context-aware prompt
        prompt = self.prompt_builder.build_analysis_prompt(
            code=code,
            file_path=file_path,
            project_context=project_context or {}
        )
        
        try:
            # Call Gemini with structured output
            response = self._generate_analysis(prompt)
            
            # Parse and validate response
            issues = self._parse_response(response)
            
            # Add file path to all issues
            if file_path:
                for issue in issues:
                    issue['file'] = file_path
            
            return issues
            
        except Exception as e:
            # Return error as an issue so it's visible to user
            return [{
                'severity': 'error',
                'category': 'analysis_error',
                'title': 'LLM Analysis Failed',
                'description': f'Failed to analyze code with Gemini: {str(e)}',
                'file': file_path,
                'suggestion': 'For larger files, try: 1) --no-llm flag, 2) AI Studio: https://aistudio.google.com, 3) smaller code portions',
                'confidence': 1.0
            }]
    
    def _generate_analysis(self, prompt: str) -> str:
        """Generate analysis using Gemini API with retry logic."""
        import time
        
        # Get model from environment or use default
        model_name = os.environ.get('GEMINI_MODEL', 'gemini-2.5-pro')
        model = genai.GenerativeModel(model_name)
        
        # Configure generation parameters
        generation_config = genai.GenerationConfig(
            temperature=0.3,
            top_p=0.9,
            max_output_tokens=32768,  # More conservative limit to avoid errors
        )
        
        # Retry configuration
        max_retries = 3
        retry_delays = [30, 60, 120]  # Longer delays: 30s, 1min, 2min between retries
        
        last_error = None
        
        for attempt in range(max_retries):
            try:
                # Log retry attempt if not first
                if attempt > 0:
                    import sys
                    print(f"Retry attempt {attempt + 1}/{max_retries} after {retry_delays[attempt-1]}s delay...", file=sys.stderr)
                elif attempt == 0:
                    import sys
                    print(f"Calling Gemini API (be patient, this may take several minutes for large files)...", file=sys.stderr)
                
                # API call (Gemini will handle its own timeouts)
                response = model.generate_content(
                    prompt,
                    generation_config=generation_config
                )
                
                # Check if response was blocked
                if hasattr(response, 'prompt_feedback') and response.prompt_feedback:
                    if hasattr(response.prompt_feedback, 'block_reason') and response.prompt_feedback.block_reason:
                        raise Exception(f"Response blocked: {response.prompt_feedback.block_reason}")
                
                # Handle multi-part responses
                try:
                    # Try simple text accessor first
                    return response.text
                except Exception as e:
                    # If that fails, try accessing parts
                    pass
                
                # Try accessing via candidates
                if hasattr(response, 'candidates') and response.candidates:
                    candidate = response.candidates[0]
                    
                    # Check finish reason
                    if hasattr(candidate, 'finish_reason'):
                        finish_reason = str(candidate.finish_reason)
                        if 'SAFETY' in finish_reason:
                            raise Exception("Content generation stopped for safety reasons")
                        elif 'MAX_TOKENS' in finish_reason:
                            # This is expected with our limit, just continue
                            pass
                    
                    if hasattr(candidate, 'content') and hasattr(candidate.content, 'parts'):
                        text_parts = []
                        for part in candidate.content.parts:
                            if hasattr(part, 'text'):
                                text_parts.append(part.text)
                        if text_parts:
                            return ' '.join(text_parts)
                
                # Try direct parts access
                if hasattr(response, 'parts'):
                    text_parts = []
                    for part in response.parts:
                        if hasattr(part, 'text'):
                            text_parts.append(part.text)
                    if text_parts:
                        return ' '.join(text_parts)
                
                raise Exception("Unable to extract text from Gemini response")
                
            except Exception as e:
                last_error = e
                error_str = str(e)
                
                # Check if it's a retryable error
                retryable_errors = [
                    '500', 'Internal', 'internal error',
                    '503', 'Service Unavailable',
                    '429', 'Resource Exhausted',
                    'Deadline Exceeded', 'timeout'
                ]
                
                is_retryable = any(err in error_str for err in retryable_errors)
                
                if is_retryable and attempt < max_retries - 1:
                    # Wait before retry
                    time.sleep(retry_delays[attempt])
                    continue
                else:
                    # Non-retryable error or last attempt
                    break
        
        # All retries failed
        raise Exception(f"Gemini API error after {max_retries} attempts: {str(last_error)}")
    
    def _parse_response(self, response: str) -> List[Dict[str, Any]]:
        """Parse and validate Gemini's JSON response."""
        try:
            # First try to extract JSON between tags
            json_match = re.search(r'<json>\s*(.*?)\s*</json>', response, re.DOTALL)
            if json_match:
                json_str = json_match.group(1)
                issues = json.loads(json_str)
            else:
                # Fall back to extracting JSON array
                json_match = re.search(r'\[.*\]', response, re.DOTALL)
                if json_match:
                    json_str = json_match.group(0)
                    issues = json.loads(json_str)
                else:
                    # Try parsing the whole response as JSON
                    issues = json.loads(response)
            
            # Validate and clean up each issue
            validated_issues = []
            for issue in issues:
                if self._validate_issue(issue):
                    validated_issues.append(self._clean_issue(issue))
            
            return validated_issues
            
        except json.JSONDecodeError as e:
            # If JSON parsing fails, try to extract useful information
            # Log the parsing error for debugging
            import sys
            print(f"JSON parsing error: {e}", file=sys.stderr)
            print(f"Response excerpt: {response[:500]}...", file=sys.stderr)
            return self._fallback_parse(response)
    
    def _validate_issue(self, issue: Dict[str, Any]) -> bool:
        """Validate that an issue has required fields."""
        required_fields = ['severity', 'title', 'description']
        return all(field in issue for field in required_fields)
    
    def _clean_issue(self, issue: Dict[str, Any]) -> Dict[str, Any]:
        """Clean and standardize issue format."""
        # Ensure severity is valid
        valid_severities = ['error', 'warning', 'info']
        if issue.get('severity', '').lower() not in valid_severities:
            issue['severity'] = 'info'
        else:
            issue['severity'] = issue['severity'].lower()
        
        # Set defaults for optional fields
        issue.setdefault('category', 'general')
        issue.setdefault('confidence', 0.8)
        issue.setdefault('line_numbers', [])
        issue.setdefault('references', [])
        
        return issue
    
    def _fallback_parse(self, response: str) -> List[Dict[str, Any]]:
        """Fallback parser if JSON parsing fails."""
        # Try to extract issues from text format
        issues = []
        
        # Look for severity patterns
        patterns = [
            (r'(?:ERROR|CRITICAL):\s*(.+?)(?:\n|$)', 'error'),
            (r'(?:WARNING):\s*(.+?)(?:\n|$)', 'warning'),
            (r'(?:INFO|SUGGESTION):\s*(.+?)(?:\n|$)', 'info')
        ]
        
        for pattern, severity in patterns:
            matches = re.findall(pattern, response, re.MULTILINE)
            for match in matches:
                issues.append({
                    'severity': severity,
                    'title': match.strip()[:100],  # First 100 chars as title
                    'description': match.strip(),
                    'category': 'general',
                    'confidence': 0.6  # Lower confidence for fallback parsing
                })
        
        if not issues:
            # If no patterns found, return the whole response as info
            issues.append({
                'severity': 'info',
                'title': 'Analysis Notes',
                'description': response.strip(),
                'category': 'general',
                'confidence': 0.5
            })
        
        return issues
    
    def analyze_project(self, project_path: str, file_patterns: List[str] = None) -> Dict[str, Any]:
        """
        Analyze an entire project.
        
        Args:
            project_path: Root directory of the project
            file_patterns: List of glob patterns for files to analyze
            
        Returns:
            Dictionary with project-wide analysis results
        """
        from pathlib import Path
        import glob
        
        project_path = Path(project_path)
        if not project_path.exists():
            raise ValueError(f"Project path does not exist: {project_path}")
        
        # Default patterns
        if file_patterns is None:
            file_patterns = ['**/*.py']
        
        # Collect all files
        all_files = []
        for pattern in file_patterns:
            all_files.extend(project_path.glob(pattern))
        
        # Filter out common non-source files
        excluded_dirs = {'__pycache__', '.git', 'venv', 'env', '.env', 'node_modules'}
        all_files = [f for f in all_files if not any(excluded in f.parts for excluded in excluded_dirs)]
        
        # Analyze each file
        results = {
            'project_path': str(project_path),
            'files_analyzed': [],
            'total_issues': 0,
            'issues_by_severity': {'error': 0, 'warning': 0, 'info': 0},
            'issues_by_file': {}
        }
        
        for file_path in all_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    code = f.read()
                
                # Skip empty files
                if not code.strip():
                    continue
                
                # Analyze file
                issues = self.analyze(code, str(file_path))
                
                if issues:
                    results['files_analyzed'].append(str(file_path))
                    results['issues_by_file'][str(file_path)] = issues
                    results['total_issues'] += len(issues)
                    
                    for issue in issues:
                        severity = issue.get('severity', 'info')
                        results['issues_by_severity'][severity] += 1
                        
            except Exception as e:
                # Log error but continue with other files
                results['issues_by_file'][str(file_path)] = [{
                    'severity': 'error',
                    'title': 'File Analysis Error',
                    'description': f'Could not analyze file: {str(e)}',
                    'category': 'file_error'
                }]
        
        return results