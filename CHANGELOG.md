# Changelog

All notable changes to DeepOptimizer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2025-01-06

### Added
- Retry logic for Gemini API calls with exponential backoff (3 attempts)
- Better error messages suggesting AI Studio for large file analysis
- Progress messages showing API calls and retries

### Changed
- Limited LLM output to 10 most critical issues to prevent timeouts
- Reduced max_output_tokens to 32k for better stability
- Improved prompt to prioritize issues by severity

### Fixed
- LLM analysis failures on larger files due to timeouts
- Better handling of multi-part responses from Gemini
- Graceful fallback to rule-based analysis when LLM fails

## [0.1.1] - 2025-01-06

### Fixed
- Complete Windows compatibility with proper Unicode handling
- All CLI output now works correctly on Windows terminals  
- Fixed IndentationError in analyzer.py
- Fixed pyproject.toml license field format

### Changed
- Minimum Python version updated to 3.9 (required by google-generativeai)
- Replaced all Unicode characters with ASCII alternatives on Windows
- Improved error messages and formatting

### Added
- Pre-push validation script for catching issues before deployment
- .gitattributes for consistent line endings
- Comprehensive Unicode safe_print utility

## [0.1.0] - 2025-01-05

### Added
- Initial release of DeepOptimizer CLI tool
- Rule-based detection for common ML bugs and anti-patterns
- Gemini AI-powered code analysis for deep insights  
- Knowledge base of 70+ ML optimization techniques
- Support for analyzing single files or entire projects
- Multiple output formats (rich terminal, JSON, Markdown)
- Severity levels (error, warning, info) for issue prioritization
- Beautiful CLI output with colors and progress bars
- Configuration file support (.deepoptimizer)
- Environment variable support via .env files

### Features
- Detects missing `model.eval()` in validation functions
- Identifies memory leaks from tensor accumulation
- Catches wrong loss functions for tasks
- Finds suboptimal batch sizes and learning rates
- Detects missing weight initialization
- Identifies deep networks without skip connections
- And many more ML-specific issues

### Security
- API keys stored securely in environment variables
- No data sent to external services except Gemini API

### Author
- Created by Willy Nilsson as a portfolio project

[0.1.0]: https://github.com/willynilsson/deepoptimizer/releases/tag/v0.1.0