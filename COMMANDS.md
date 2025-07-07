# DeepOptimizer - Command Reference

## 🚀 CLI Tool Commands

### Installation
```bash
# From PyPI (when published)
pip install deepoptimizer

# From TestPyPI (current release candidate)
pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple/ deepoptimizer==0.1.0rc1

# From source
git clone https://github.com/willynilsson/deepoptimizer.git
cd deepoptimizer
pip install -e .
```

### Basic Usage
```bash
# Set up Gemini API key (required for LLM analysis)
export GEMINI_API_KEY="your-api-key-here"

# Analyze a single file
deepoptimizer analyze path/to/model.py

# Analyze without LLM (rule-based only)
deepoptimizer analyze path/to/model.py --no-llm

# Analyze entire project
deepoptimizer analyze src/

# Show specific technique information
deepoptimizer technique-info gradient-accumulation

# Browse all techniques
deepoptimizer techniques

# Check setup
deepoptimizer doctor
```

### Analysis Options
```bash
# Output formats
deepoptimizer analyze model.py --output json
deepoptimizer analyze model.py --output markdown

# Save results
deepoptimizer analyze model.py --output-file analysis.json

# Verbose output
deepoptimizer analyze model.py --verbose

# Interactive fix mode (experimental)
deepoptimizer fix model.py
```

## 🌐 Website Development

### Setup
```bash
# Navigate to website directory
cd website/

# Install dependencies
npm install
```

### Development
```bash
# Start development server with hot reload
npm run dev
# → http://localhost:5173

# Run tests
npm test
npm run test:ui  # With UI
npm run test:coverage  # Coverage report
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
# → http://localhost:4173

# Build outputs to dist/
```

## 📦 Package Development

### Setup Development Environment
```bash
# Clone repository
git clone https://github.com/willynilsson/deepoptimizer.git
cd deepoptimizer

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install in development mode
pip install -e ".[dev]"
```

### Running Tests
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=deepoptimizer

# Run specific test file
pytest tests/test_analyzer.py

# Run tests in parallel
pytest -n auto
```

### Code Quality
```bash
# Format code
black deepoptimizer tests

# Sort imports
isort deepoptimizer tests

# Lint code
flake8 deepoptimizer tests

# Type checking
mypy deepoptimizer
```

### Building Distribution
```bash
# Install build tools
pip install --upgrade build twine

# Clean previous builds
rm -rf dist/ build/ *.egg-info

# Build package
python -m build

# Check package
twine check dist/*

# Upload to TestPyPI
twine upload --repository testpypi dist/*

# Upload to PyPI (when ready)
twine upload dist/*
```

## 🚀 Deployment

### GitHub Pages (Website)
```bash
# The website automatically deploys via GitHub Actions
# Just push to main branch:
git push origin main

# Manual deployment:
cd website
npm run build
# Upload dist/ contents to GitHub Pages
```

### PyPI Release Process
```bash
# 1. Update version in pyproject.toml
# 2. Create git tag
git tag -a v0.1.0 -m "Release version 0.1.0"
git push origin v0.1.0

# 3. Build and upload
python -m build
twine upload dist/*
```

## 📝 Project Structure

```
deepoptimizer/
├── deepoptimizer/          # Main package
│   ├── __init__.py
│   ├── analyzer.py         # Core analysis engine
│   ├── cli.py             # Command-line interface
│   ├── formatter.py       # Output formatting
│   ├── knowledge_base.py  # ML techniques database
│   ├── llm_analyzer.py    # Gemini integration
│   ├── rule_detector.py   # Pattern detection
│   └── fixtures/          # JSON knowledge base
│       └── *.json         # 9 files, 55+ techniques
├── website/               # React documentation site
│   ├── src/
│   ├── public/
│   └── package.json
├── examples/              # Demo code
│   └── demo_model/
│       └── simple_mnist_model.py
├── tests/                 # Test suite
├── pyproject.toml        # Package configuration
└── README.md
```

## 🔧 Common Tasks

### Adding New ML Techniques
```bash
# Edit appropriate fixture file
vim deepoptimizer/fixtures/optimizer_techniques.json

# Add new technique following schema:
{
  "name": "technique-name",
  "category": "optimization",
  "severity": "warning|info|error",
  "description": "What it does",
  "explanation": "Why it matters",
  "fix_suggestion": "How to apply it"
}
```

### Testing CLI Changes Locally
```bash
# Install in editable mode
pip install -e .

# Test directly
deepoptimizer analyze examples/demo_model/simple_mnist_model.py
```

### Updating Website Content
```bash
# Website components are in:
website/src/components/

# After changes, test locally:
cd website
npm run dev
```

## 🐛 Troubleshooting

### Common Issues

**Import errors:**
```bash
# Ensure you're in the right environment
which python
pip list | grep deepoptimizer
```

**API key issues:**
```bash
# Check if key is set
echo $GEMINI_API_KEY

# Set temporarily
export GEMINI_API_KEY="your-key"

# Set permanently (add to ~/.bashrc or ~/.zshrc)
echo 'export GEMINI_API_KEY="your-key"' >> ~/.bashrc
```

**Website build issues:**
```bash
# Clear cache and reinstall
cd website
rm -rf node_modules package-lock.json
npm install
```

## 📊 Demo & Examples

### Quick Demo
```bash
# Analyze the included demo model
deepoptimizer analyze examples/demo_model/simple_mnist_model.py

# Expected output:
# - Sigmoid activation warning
# - Missing normalization layers
# - Small learning rate for SGD
```

### Real-World Examples
```bash
# Analyze a transformer model
deepoptimizer analyze models/transformer.py

# Analyze training script
deepoptimizer analyze train.py --verbose

# Check entire ML project
deepoptimizer analyze src/ --output-file project-analysis.json
```

## 🔗 Useful Links

- **GitHub**: https://github.com/willynilsson/deepoptimizer
- **Website**: https://willynilsson.github.io/deepoptimizer/
- **TestPyPI**: https://test.pypi.org/project/deepoptimizer/
- **Get Gemini API Key**: https://makersuite.google.com/app/apikey