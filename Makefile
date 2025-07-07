.PHONY: help install install-dev clean test test-cov lint format type-check docs serve-docs build upload check-all

# Default target
help:
	@echo "DeepOptimizer Development Commands"
	@echo "================================="
	@echo ""
	@echo "Installation:"
	@echo "  make install       Install package in production mode"
	@echo "  make install-dev   Install package in development mode with all dependencies"
	@echo ""
	@echo "Testing:"
	@echo "  make test          Run test suite"
	@echo "  make test-cov      Run tests with coverage report"
	@echo "  make test-fast     Run tests in parallel"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint          Run all linters (flake8, pylint)"
	@echo "  make format        Format code with black and isort"
	@echo "  make type-check    Run mypy type checking"
	@echo "  make check-all     Run all checks (lint, type-check, test)"
	@echo ""
	@echo "Documentation:"
	@echo "  make docs          Build documentation"
	@echo "  make serve-docs    Serve documentation locally"
	@echo ""
	@echo "Building & Publishing:"
	@echo "  make build         Build distribution packages"
	@echo "  make upload        Upload to PyPI (requires credentials)"
	@echo "  make upload-test   Upload to TestPyPI"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean         Remove build artifacts and cache files"
	@echo "  make update-deps   Update all dependencies"

# Installation targets
install:
	pip install -e .

install-dev:
	pip install -e ".[dev,visualization,research]"
	pre-commit install

# Cleaning
clean:
	@echo "Cleaning build artifacts..."
	rm -rf build/
	rm -rf dist/
	rm -rf *.egg-info
	rm -rf .eggs/
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.coverage" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +
	rm -rf htmlcov/
	rm -rf .coverage
	rm -rf coverage.xml
	@echo "Clean complete!"

# Testing
test:
	@echo "Running tests..."
	pytest -v

test-cov:
	@echo "Running tests with coverage..."
	pytest --cov=deepoptimizer --cov-report=term-missing --cov-report=html -v
	@echo "Coverage report generated in htmlcov/index.html"

test-fast:
	@echo "Running tests in parallel..."
	pytest -n auto -v

# Code quality
lint:
	@echo "Running flake8..."
	flake8 src/ tests/
	@echo ""
	@echo "Running pylint..."
	pylint src/deepoptimizer

format:
	@echo "Formatting code with black..."
	black src/ tests/ examples/
	@echo ""
	@echo "Sorting imports with isort..."
	isort src/ tests/ examples/

type-check:
	@echo "Running mypy type checking..."
	mypy src/deepoptimizer

check-all: lint type-check test

# Documentation
docs:
	@echo "Building documentation..."
	cd docs && sphinx-build -b html . _build/html
	@echo "Documentation built in docs/_build/html/"

serve-docs: docs
	@echo "Serving documentation at http://localhost:8000"
	cd docs/_build/html && python -m http.server

# Building and distribution
build: clean
	@echo "Building distribution packages..."
	python -m build
	@echo "Build complete! Packages in dist/"

upload: build
	@echo "Uploading to PyPI..."
	twine upload dist/*

upload-test: build
	@echo "Uploading to TestPyPI..."
	twine upload --repository testpypi dist/*

# Development utilities
update-deps:
	@echo "Updating dependencies..."
	pip install --upgrade pip setuptools wheel
	pip install --upgrade -r requirements.txt
	pip install --upgrade -r requirements-dev.txt

# Git hooks
pre-commit:
	pre-commit run --all-files

# Create source distribution
sdist:
	python -m build --sdist

# Create wheel distribution
wheel:
	python -m build --wheel

# Run security checks
security:
	@echo "Running security checks..."
	bandit -r src/
	safety check

# Profile code
profile:
	@echo "Profiling code..."
	py-spy top -- python examples/basic_optimization.py

# Run benchmark tests
benchmark:
	@echo "Running benchmarks..."
	pytest tests/benchmarks/ -v --benchmark-only

# Generate requirements from pyproject.toml
requirements:
	pip-compile pyproject.toml -o requirements.txt
	pip-compile --extra dev pyproject.toml -o requirements-dev.txt

# Initialize project (first time setup)
init: install-dev
	@echo "Creating necessary directories..."
	mkdir -p data logs experiments results
	@echo "Project initialized!"

# Run example scripts
example-basic:
	python examples/basic_optimization.py

example-agents:
	python examples/multi_agent_research.py

# Docker targets (if using Docker)
docker-build:
	docker build -t deepoptimizer:latest .

docker-run:
	docker run -it --rm deepoptimizer:latest

# Version management
version:
	@python -c "import deepoptimizer; print(f'DeepOptimizer version: {deepoptimizer.__version__}')"

# Create a new release
release: check-all
	@echo "Preparing release..."
	@echo "1. Update version in pyproject.toml"
	@echo "2. Update CHANGELOG.md"
	@echo "3. Commit changes"
	@echo "4. Create git tag"
	@echo "5. Run 'make upload' to publish"