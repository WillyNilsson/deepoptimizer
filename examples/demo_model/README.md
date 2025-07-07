# DeepOptimizer Demo Model

This directory contains a demo PyTorch model with intentional inefficiencies that DeepOptimizer can detect.

## simple_mnist_model.py

An intentionally inefficient CNN model that demonstrates common ML issues:

### Issues Present:
1. **No batch normalization** - Missing normalization layers
2. **Poor activation functions** - Using sigmoid (vanishing gradients)
3. **Missing model.eval()** - During validation
4. **No torch.no_grad()** - During inference
5. **Memory leak** - Accumulating loss without .item()
6. **Wrong loss function** - Using MSE for classification
7. **Small batch size** - Poor GPU utilization
8. **CPU to GPU transfers** - Creating tensors on CPU then moving

## Usage

Analyze this file with DeepOptimizer:

```bash
# With LLM analysis (requires Gemini API key)
deepoptimizer analyze simple_mnist_model.py

# Rule-based only (no API key needed)
deepoptimizer analyze simple_mnist_model.py --no-llm
```

## Expected Output

DeepOptimizer will detect issues like:
- ⚠️ **Performance Warnings**: Sigmoid activation, missing normalization
- ℹ️ **Suggestions**: Small learning rate for SGD optimizer

This demonstrates how DeepOptimizer helps catch common ML bugs and inefficiencies before training.