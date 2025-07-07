#!/usr/bin/env python3
"""
Pre-push validation script to catch common errors before pushing to GitHub.
Run this before committing/pushing to avoid CI failures.
"""

import ast
import subprocess
import sys
from pathlib import Path
import json
import tempfile
import shutil


def check_syntax_errors():
    """Check all Python files for syntax errors."""
    print("🔍 Checking Python syntax...")
    
    project_root = Path(__file__).parent.parent
    python_files = []
    
    # Find all Python files
    for pattern in ['**/*.py']:
        python_files.extend(project_root.glob(pattern))
    
    # Exclude common directories
    exclude_dirs = {'venv', 'env', '__pycache__', '.git', 'node_modules', 'dist', 'build'}
    python_files = [f for f in python_files if not any(ex in f.parts for ex in exclude_dirs)]
    
    errors = []
    for file_path in python_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Try to parse the file
            ast.parse(content, filename=str(file_path))
            
            # Also try to compile it
            compile(content, str(file_path), 'exec')
            
        except SyntaxError as e:
            errors.append(f"  ❌ {file_path}: {e.msg} (line {e.lineno})")
        except Exception as e:
            errors.append(f"  ❌ {file_path}: {str(e)}")
    
    if errors:
        print(f"Found {len(errors)} syntax error(s):")
        for error in errors:
            print(error)
        return False
    else:
        print(f"  ✅ All {len(python_files)} Python files have valid syntax")
        return True


def check_json_files():
    """Check all JSON files for valid syntax."""
    print("\n🔍 Checking JSON files...")
    
    project_root = Path(__file__).parent.parent
    json_files = list(project_root.glob('**/*.json'))
    
    # Exclude common directories
    exclude_dirs = {'venv', 'env', '__pycache__', '.git', 'node_modules', 'dist', 'build'}
    json_files = [f for f in json_files if not any(ex in f.parts for ex in exclude_dirs)]
    
    errors = []
    for file_path in json_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                json.load(f)
        except json.JSONDecodeError as e:
            errors.append(f"  ❌ {file_path}: {e.msg} (line {e.lineno})")
        except Exception as e:
            errors.append(f"  ❌ {file_path}: {str(e)}")
    
    if errors:
        print(f"Found {len(errors)} JSON error(s):")
        for error in errors:
            print(error)
        return False
    else:
        print(f"  ✅ All {len(json_files)} JSON files are valid")
        return True


def check_package_installation():
    """Test if the package can be imported and installed."""
    print("\n🔍 Testing package imports and installation...")
    
    project_root = Path(__file__).parent.parent
    
    # First, check if we can import it locally
    try:
        # Add project root to Python path temporarily
        original_path = sys.path.copy()
        sys.path.insert(0, str(project_root))
        
        # Try to import the package
        try:
            import deepoptimizer
            version = deepoptimizer.__version__
            print(f"  ✅ Package imports successfully (version: {version})")
            
            # Test that CLI entry point exists
            from deepoptimizer.cli import main
            print("  ✅ CLI entry point found")
            
        except ImportError as e:
            print(f"  ❌ Import failed: {e}")
            return False
        except Exception as e:
            print(f"  ❌ Error during import: {e}")
            return False
        finally:
            # Restore original path
            sys.path = original_path
    except Exception as e:
        print(f"  ❌ Error during import test: {str(e)}")
        return False
    
    # Now test pip installation in a temp directory
    print("\n  🔧 Testing pip installation (this simulates GitHub Actions)...")
    with tempfile.TemporaryDirectory() as tmpdir:
        try:
            # Create a minimal virtual environment just for dependency resolution
            venv_path = Path(tmpdir) / 'test_env'
            subprocess.run([sys.executable, '-m', 'venv', str(venv_path)], 
                         check=True, capture_output=True)
            
            # Get pip path
            if sys.platform == 'win32':
                pip_cmd = str(venv_path / 'Scripts' / 'pip')
            else:
                pip_cmd = str(venv_path / 'bin' / 'pip')
            
            # Upgrade pip first (like GitHub Actions does)
            subprocess.run([pip_cmd, 'install', '--upgrade', 'pip'], 
                         capture_output=True)
            
            # Test package metadata can be built first
            print("  📦 Checking package metadata...")
            result = subprocess.run(
                [pip_cmd, 'install', 'build'],
                capture_output=True, text=True
            )
            
            # Try to build the package metadata
            result = subprocess.run(
                [sys.executable, '-m', 'build', '--wheel', '--no-isolation', str(project_root)],
                capture_output=True, text=True, cwd=tmpdir
            )
            
            if result.returncode != 0 and 'pyproject.toml' in result.stderr:
                print("  ❌ Package metadata build failed:")
                error_lines = result.stderr.split('\n')
                for line in error_lines:
                    if 'error:' in line.lower() or 'ERROR:' in line:
                        print(f"      {line.strip()}")
                return False
            
            # Now test installing with exact pip command GitHub uses
            print("  📥 Testing dependency resolution...")
            result = subprocess.run(
                [pip_cmd, 'install', '-e', str(project_root)],
                capture_output=True, text=True
            )
            
            if result.returncode != 0:
                print("  ❌ Package installation failed (same error GitHub Actions would get):")
                # Parse the error to show the important part
                error_lines = result.stderr.split('\n')
                for line in error_lines:
                    if 'ERROR:' in line or 'Could not find' in line or 'No matching distribution' in line:
                        print(f"      {line.strip()}")
                    if 'versions:' in line:
                        print(f"      {line.strip()}")
                return False
            
            print("  ✅ Package can be installed with all dependencies")
            return True
            
        except Exception as e:
            print(f"  ❌ Error testing installation: {str(e)}")
            return False


def check_no_debug_code():
    """Check for debug print statements or exposed secrets."""
    print("\n🔍 Checking for debug code and secrets...")
    
    project_root = Path(__file__).parent.parent
    python_files = []
    
    # Find all Python files
    for pattern in ['**/*.py']:
        python_files.extend(project_root.glob(pattern))
    
    # Exclude common directories, this script, and examples
    exclude_dirs = {'venv', 'env', '__pycache__', '.git', 'node_modules', 'dist', 'build', 'examples'}
    python_files = [f for f in python_files if not any(ex in f.parts for ex in exclude_dirs)]
    python_files = [f for f in python_files if f != Path(__file__)]
    
    issues = []
    
    for file_path in python_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.splitlines()
            
            for i, line in enumerate(lines, 1):
                # Check for print statements (excluding docstrings and comments)
                if 'print(' in line and not line.strip().startswith('#'):
                    # Parse to check if it's actually a print statement
                    try:
                        tree = ast.parse(line.strip())
                        for node in ast.walk(tree):
                            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == 'print':
                                issues.append(f"  ⚠️  {file_path}:{i} - print statement found")
                    except:
                        pass
                
                # Check for potential API keys (but not function parameters)
                if any(secret in line.lower() for secret in ['api_key=', 'apikey=', 'secret=', 'password=']):
                    # Skip if it's a function parameter or safe pattern
                    if not any(safe in line for safe in ['os.environ', 'getenv', 'None', "''", '""', 'example', 'api_key=api_key', 'api_key=self.api_key', 'def ', 'analyzer(', 'genai.configure']):
                        issues.append(f"  🔐 {file_path}:{i} - potential exposed secret")
        
        except Exception as e:
            issues.append(f"  ❌ Error checking {file_path}: {str(e)}")
    
    if issues:
        print(f"Found {len(issues)} potential issue(s):")
        for issue in issues:
            print(issue)
        return False
    else:
        print(f"  ✅ No debug code or exposed secrets found")
        return True


def check_website_build():
    """Check if the website builds successfully."""
    print("\n🔍 Testing website build...")
    
    website_dir = Path(__file__).parent.parent / 'website'
    
    if not website_dir.exists():
        print("  ⚠️  Website directory not found, skipping")
        return True
    
    try:
        # Check if node_modules exists
        if not (website_dir / 'node_modules').exists():
            print("  ℹ️  Installing website dependencies...")
            result = subprocess.run(['npm', 'ci'], cwd=website_dir, 
                                  capture_output=True, text=True)
            if result.returncode != 0:
                print("  ❌ npm install failed:")
                print(result.stderr)
                return False
        
        # Try to build
        result = subprocess.run(['npm', 'run', 'build'], cwd=website_dir, 
                              capture_output=True, text=True)
        
        if result.returncode != 0:
            print("  ❌ Website build failed:")
            print(result.stderr)
            return False
        
        print("  ✅ Website builds successfully")
        return True
        
    except FileNotFoundError:
        print("  ⚠️  npm not found, skipping website build check")
        return True
    except Exception as e:
        print(f"  ❌ Error during website build: {str(e)}")
        return False


def main():
    """Run all validation checks."""
    print("🚀 Running pre-push validation...\n")
    
    all_passed = True
    
    # Run all checks
    all_passed &= check_syntax_errors()
    all_passed &= check_json_files()
    all_passed &= check_package_installation()
    all_passed &= check_no_debug_code()
    all_passed &= check_website_build()
    
    print("\n" + "="*50)
    if all_passed:
        print("✅ All checks passed! Safe to push.")
        return 0
    else:
        print("❌ Some checks failed. Please fix the issues before pushing.")
        return 1


if __name__ == "__main__":
    sys.exit(main())