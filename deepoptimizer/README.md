# DeepOptimizer Package

Core Python package for ML code analysis.

## Installation

```bash
pip install deepoptimizer
```

## Development

```bash
# Install in development mode
pip install -e ".[dev]"

# Run tests
pytest

# Format code
black deepoptimizer
```

## Structure

```
deepoptimizer/
├── analyzer.py         # Main analysis orchestrator
├── cli.py             # Command-line interface
├── formatter.py       # Output formatting
├── knowledge_base.py  # ML techniques database
├── llm_analyzer.py    # Gemini AI integration
├── rule_detector.py   # Pattern-based detection
└── fixtures/          # JSON knowledge base (55+ techniques)
```

See main README for full documentation.