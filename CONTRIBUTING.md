# Contributing to DeepOptimizer

Thank you for your interest in contributing to DeepOptimizer! This tool was inspired by how pilots use checklists to manage complex systems safely, applied to ML code development.

## Welcome Contributors

DeepOptimizer is built on the principle that complex systems benefit from systematic checks. Contributions that align with this vision are especially welcome:

- **New detection patterns** you've found useful
- **Additional optimization techniques** with research backing  
- **Clear, actionable error messages**
- **Performance improvements** that don't complicate usage
- **Additional ML frameworks** beyond PyTorch

## What We're Looking For

### High Priority
- New ML bug patterns with test cases
- Optimization techniques with paper citations
- TensorFlow and JAX support
- Improved error messages and fixes
- Documentation improvements

### Please Avoid
- Major architecture changes without discussion
- Features that complicate the CLI interface
- Techniques without proper research backing
- Breaking changes to the API

## How to Contribute

### Reporting Issues
When reporting bugs, please include:
- Python and PyTorch versions
- Minimal code example
- Expected vs actual behavior
- Full error message if applicable

### Submitting Code

1. Fork and clone the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with clear commits
4. Add tests for new functionality
5. Run tests: `pytest tests/`
6. Submit a pull request

### Adding New Techniques

To add a new optimization technique:

1. Add to appropriate fixture file in `deepoptimizer/fixtures/`
2. Include:
   - Clear description
   - Research paper reference (required)
   - Implementation example
   - Performance impact data
3. Add detection pattern if applicable
4. Include test case

Example:
```json
{
  "name": "Technique Name",
  "category": "optimization",
  "description": "Clear explanation",
  "paper_url": "https://arxiv.org/abs/...",
  "implementation": "Code example",
  "performance_impact": {
    "speed": "+2x",
    "memory": "-30%"
  }
}
```

## Code Style

- Follow PEP 8
- Use Black for formatting: `black deepoptimizer/`
- Clear variable names over brevity
- Comments for complex logic only

## Testing

- All new features need tests
- Maintain or improve coverage
- Test both rule-based and LLM paths
- Include edge cases

## Recognition

Contributors will be acknowledged in:
- The project README
- Release notes for their contributions
- A CONTRIBUTORS.md file (for significant contributions)

## Questions?

Feel free to open an issue for discussion before implementing major changes.

---

Built by [Willy Nilsson](https://willynilsson.com) • [GitHub](https://github.com/willynilsson)