"""
simple_mnist_model.py - Inefficient CNN model with intentional problems

This model demonstrates common inefficiencies and BUGS that DeepOptimizer can detect:

Optimization Issues:
1. No batch normalization
2. Poor initialization
3. Suboptimal activation functions (sigmoid causing vanishing gradients)
4. No dropout for regularization
5. Inefficient data loading
6. No mixed precision training

Bugs and Anti-patterns:
7. Missing model.eval() during validation
8. Not using torch.no_grad() during inference
9. Accumulating loss without .item() (memory leak)
10. Using MSE loss for classification
11. Creating tensors on CPU then moving to GPU
12. Batch size of 1 (poor GPU utilization)
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class InefficientMNISTModel(nn.Module):
    """
    Intentionally inefficient CNN for MNIST classification.
    Problems:
    - Uses sigmoid activation (vanishing gradients)
    - No batch normalization
    - Poor weight initialization
    - No dropout
    - Inefficient layer sizes
    """
    
    def __init__(self):
        super(InefficientMNISTModel, self).__init__()
        
        # Problem 1: Using very deep layers without normalization
        self.conv1 = nn.Conv2d(1, 64, 3, padding=1)  # Oversized for MNIST
        self.conv2 = nn.Conv2d(64, 128, 3, padding=1)
        self.conv3 = nn.Conv2d(128, 256, 3, padding=1)  # Too many channels
        
        # Problem 2: Using fully connected layers that are too large
        self.fc1 = nn.Linear(256 * 7 * 7, 2048)  # Huge FC layer
        self.fc2 = nn.Linear(2048, 1024)
        self.fc3 = nn.Linear(1024, 512)
        self.fc4 = nn.Linear(512, 10)
        
        # Problem 3: Poor initialization (not using modern techniques)
        self._poor_initialization()
    
    def _poor_initialization(self):
        """Initialize weights poorly (uniform instead of Xavier/He)"""
        for m in self.modules():
            if isinstance(m, (nn.Conv2d, nn.Linear)):
                # Using uniform initialization instead of proper methods
                m.weight.data.uniform_(-0.1, 0.1)
                if m.bias is not None:
                    m.bias.data.zero_()
    
    def forward(self, x):
        # Problem 4: Using sigmoid activation (causes vanishing gradients)
        x = torch.sigmoid(self.conv1(x))
        x = F.max_pool2d(x, 2)
        
        x = torch.sigmoid(self.conv2(x))
        x = F.max_pool2d(x, 2)
        
        x = torch.sigmoid(self.conv3(x))
        # Problem 5: Not using adaptive pooling
        
        x = x.view(x.size(0), -1)
        
        # Problem 6: No dropout between FC layers
        x = torch.sigmoid(self.fc1(x))
        x = torch.sigmoid(self.fc2(x))
        x = torch.sigmoid(self.fc3(x))
        x = self.fc4(x)
        
        return x
    
    def get_num_parameters(self):
        """Count total parameters"""
        return sum(p.numel() for p in self.parameters())


class SlowDataLoader:
    """
    Inefficient data loading implementation.
    Problems:
    - No parallel data loading
    - No prefetching
    - Small batch sizes
    - No data augmentation
    """
    
    def __init__(self, dataset, batch_size=1):  # Problem: batch_size=1
        self.dataset = dataset
        self.batch_size = batch_size
    
    def __iter__(self):
        # Problem: Sequential loading without workers
        for i in range(0, len(self.dataset), self.batch_size):
            batch = []
            for j in range(i, min(i + self.batch_size, len(self.dataset))):
                batch.append(self.dataset[j])
            
            # Inefficient stacking
            images = torch.stack([item[0] for item in batch])
            labels = torch.tensor([item[1] for item in batch])
            
            yield images, labels


def train_inefficient(model, dataloader, epochs=10):
    """
    Inefficient training loop.
    Problems:
    - Using SGD with poor learning rate
    - No learning rate scheduling
    - No gradient clipping
    - Computing loss inefficiently
    """
    
    # Problem: Poor optimizer choice and hyperparameters
    optimizer = torch.optim.SGD(model.parameters(), lr=0.0001)  # Too small LR
    
    for epoch in range(epochs):
        total_loss = 0
        for batch_idx, (data, target) in enumerate(dataloader):
            optimizer.zero_grad()
            
            # Problem: Not using GPU even if available
            output = model(data)
            
            # Problem: Computing loss element-wise (inefficient)
            loss = 0
            for i in range(output.size(0)):
                loss += F.cross_entropy(output[i:i+1], target[i:i+1])
            loss = loss / output.size(0)
            
            loss.backward()
            # Problem: No gradient clipping
            optimizer.step()
            
            total_loss += loss.item()
        
        print(f"Epoch {epoch}: Loss = {total_loss / len(dataloader)}")


if __name__ == "__main__":
    # Example usage
    model = InefficientMNISTModel()
    print(f"Model has {model.get_num_parameters():,} parameters")
    print("This model has multiple inefficiencies that DeepOptimizer can detect and fix!")