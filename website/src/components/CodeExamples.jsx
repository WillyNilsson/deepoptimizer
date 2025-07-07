import { useState } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiChevronLeft, FiChevronRight, FiCopy, FiCheck } from 'react-icons/fi';

const CodeExamples = () => {
  const [currentExample, setCurrentExample] = useState(0);
  const [copiedStates, setCopiedStates] = useState({});

  const examples = [
    {
      title: 'Flash Attention Implementation',
      description: 'Replace standard attention with Flash Attention 2.0 for 3x speedup',
      before: `# Before: Standard Attention
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        
    def forward(self, x, mask=None):
        batch_size, seq_len, _ = x.size()
        
        # Linear transformations
        Q = self.W_q(x).view(batch_size, seq_len, self.n_heads, self.d_k)
        K = self.W_k(x).view(batch_size, seq_len, self.n_heads, self.d_k)
        V = self.W_v(x).view(batch_size, seq_len, self.n_heads, self.d_k)
        
        # Compute attention scores
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
            
        attention = F.softmax(scores, dim=-1)
        context = torch.matmul(attention, V)
        
        # Reshape and apply output projection
        context = context.transpose(1, 2).contiguous().view(
            batch_size, seq_len, self.d_model
        )
        output = self.W_o(context)
        
        return output`,
      after: `# After: Flash Attention 2.0
from flash_attn import flash_attn_func

class FlashMultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        
        self.W_qkv = nn.Linear(d_model, 3 * d_model, bias=False)
        self.W_o = nn.Linear(d_model, d_model)
        
    def forward(self, x, mask=None):
        batch_size, seq_len, _ = x.size()
        
        # Compute Q, K, V in one operation
        qkv = self.W_qkv(x)
        qkv = qkv.reshape(batch_size, seq_len, 3, self.n_heads, self.d_k)
        qkv = qkv.permute(2, 0, 3, 1, 4)  # [3, B, H, S, D]
        q, k, v = qkv[0], qkv[1], qkv[2]
        
        # Use Flash Attention (3x faster, 10x less memory)
        context = flash_attn_func(
            q, k, v,
            dropout_p=0.0,
            softmax_scale=1.0 / math.sqrt(self.d_k),
            causal=mask is not None
        )
        
        # Reshape and apply output projection
        context = context.reshape(batch_size, seq_len, self.d_model)
        output = self.W_o(context)
        
        return output
        
# Performance gains:
# - 3.2x faster on A100 GPU
# - 10x less memory usage
# - Enables 8x longer sequences`,
      metrics: {
        speed: '+3.2x',
        memory: '-90%',
        accuracy: '100%',
      },
    },
    {
      title: 'Mixed Precision Training',
      description: 'Use automatic mixed precision for 2x faster training with minimal accuracy loss',
      before: `# Before: FP32 Training
def train_epoch(model, dataloader, optimizer, criterion):
    model.train()
    total_loss = 0
    
    for batch_idx, (inputs, targets) in enumerate(dataloader):
        inputs, targets = inputs.cuda(), targets.cuda()
        
        # Forward pass
        outputs = model(inputs)
        loss = criterion(outputs, targets)
        
        # Backward pass
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        total_loss += loss.item()
        
        if batch_idx % 100 == 0:
            print(f'Batch {batch_idx}: Loss = {loss.item():.4f}')
    
    return total_loss / len(dataloader)

# Training loop
model = ResNet50().cuda()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss()

for epoch in range(num_epochs):
    loss = train_epoch(model, train_loader, optimizer, criterion)
    print(f'Epoch {epoch}: Average Loss = {loss:.4f}')`,
      after: `# After: Mixed Precision Training with AMP
from torch.cuda.amp import autocast, GradScaler

def train_epoch(model, dataloader, optimizer, criterion, scaler):
    model.train()
    total_loss = 0
    
    for batch_idx, (inputs, targets) in enumerate(dataloader):
        inputs, targets = inputs.cuda(), targets.cuda()
        
        # Mixed precision forward pass
        with autocast():
            outputs = model(inputs)
            loss = criterion(outputs, targets)
        
        # Scaled backward pass
        optimizer.zero_grad()
        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()
        
        total_loss += loss.item()
        
        if batch_idx % 100 == 0:
            print(f'Batch {batch_idx}: Loss = {loss.item():.4f}')
    
    return total_loss / len(dataloader)

# Training loop with AMP
model = ResNet50().cuda()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss()
scaler = GradScaler()

# Enable TF32 on Ampere GPUs
torch.backends.cuda.matmul.allow_tf32 = True
torch.backends.cudnn.allow_tf32 = True

for epoch in range(num_epochs):
    loss = train_epoch(model, train_loader, optimizer, criterion, scaler)
    print(f'Epoch {epoch}: Average Loss = {loss:.4f}')
    
# Performance gains:
# - 2.1x faster training on V100/A100
# - 50% less memory usage
# - <0.1% accuracy difference`,
      metrics: {
        speed: '+2.1x',
        memory: '-50%',
        accuracy: '99.9%',
      },
    },
    {
      title: 'Gradient Checkpointing',
      description: 'Trade compute for memory to enable larger batch sizes',
      before: `# Before: Standard Transformer Block
class TransformerBlock(nn.Module):
    def __init__(self, d_model, n_heads, d_ff, dropout=0.1):
        super().__init__()
        self.attention = MultiHeadAttention(d_model, n_heads)
        self.norm1 = nn.LayerNorm(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model),
            nn.Dropout(dropout)
        )
        self.norm2 = nn.LayerNorm(d_model)
        
    def forward(self, x, mask=None):
        # Self-attention
        attn_out = self.attention(self.norm1(x), mask)
        x = x + attn_out
        
        # Feed-forward
        ffn_out = self.ffn(self.norm2(x))
        x = x + ffn_out
        
        return x

class Transformer(nn.Module):
    def __init__(self, n_layers, d_model, n_heads, d_ff):
        super().__init__()
        self.layers = nn.ModuleList([
            TransformerBlock(d_model, n_heads, d_ff)
            for _ in range(n_layers)
        ])
        
    def forward(self, x, mask=None):
        for layer in self.layers:
            x = layer(x, mask)
        return x`,
      after: `# After: Gradient Checkpointing
from torch.utils.checkpoint import checkpoint

class TransformerBlock(nn.Module):
    def __init__(self, d_model, n_heads, d_ff, dropout=0.1):
        super().__init__()
        self.attention = MultiHeadAttention(d_model, n_heads)
        self.norm1 = nn.LayerNorm(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model),
            nn.Dropout(dropout)
        )
        self.norm2 = nn.LayerNorm(d_model)
        
    def forward(self, x, mask=None):
        # Self-attention with checkpointing
        def attn_forward(x, mask):
            return self.attention(self.norm1(x), mask)
        
        if self.training:
            attn_out = checkpoint(attn_forward, x, mask)
        else:
            attn_out = attn_forward(x, mask)
        x = x + attn_out
        
        # Feed-forward with checkpointing
        def ffn_forward(x):
            return self.ffn(self.norm2(x))
            
        if self.training:
            ffn_out = checkpoint(ffn_forward, x)
        else:
            ffn_out = ffn_forward(x)
        x = x + ffn_out
        
        return x

class Transformer(nn.Module):
    def __init__(self, n_layers, d_model, n_heads, d_ff):
        super().__init__()
        self.layers = nn.ModuleList([
            TransformerBlock(d_model, n_heads, d_ff)
            for _ in range(n_layers)
        ])
        
    def forward(self, x, mask=None):
        for i, layer in enumerate(self.layers):
            # Checkpoint every other layer
            if self.training and i % 2 == 0:
                x = checkpoint(layer, x, mask)
            else:
                x = layer(x, mask)
        return x
        
# Performance gains:
# - 40% memory reduction
# - 1.5x larger batch sizes
# - 15% slower forward pass (worth it!)`,
      metrics: {
        speed: '-15%',
        memory: '-40%',
        accuracy: '100%',
      },
    },
  ];

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates({ ...copiedStates, [id]: true });
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [id]: false });
      }, 2000);
    } catch (err) {
      // Failed to copy to clipboard
    }
  };

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % examples.length);
  };

  const prevExample = () => {
    setCurrentExample((prev) => (prev - 1 + examples.length) % examples.length);
  };

  return (
    <section id="examples" className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Real-World <span className="gradient-text">Code Examples</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            See examples of optimizations that DeepOptimizer can suggest, showing
            before/after code with measurable performance improvements.
          </p>
        </motion.div>

        <div className="relative">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <motion.h3 
              key={currentExample}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-semibold text-gray-900 dark:text-gray-100"
            >
              {examples[currentExample].title}
            </motion.h3>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={prevExample}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <FiChevronLeft size={20} />
              </button>
              
              <div className="flex space-x-2">
                {examples.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentExample(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentExample
                        ? 'w-8 bg-primary-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextExample}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>

          <motion.p
            key={`desc-${currentExample}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 dark:text-gray-400 mb-8"
          >
            {examples[currentExample].description}
          </motion.p>

          {/* Code comparison */}
          <motion.div
            key={`code-${currentExample}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {/* Before */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-red-600 dark:text-red-400">Before Optimization</h4>
                <button
                  onClick={() => copyToClipboard(examples[currentExample].before, `before-${currentExample}`)}
                  className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {copiedStates[`before-${currentExample}`] ? (
                    <FiCheck className="text-green-500" />
                  ) : (
                    <FiCopy className="text-gray-500" />
                  )}
                </button>
              </div>
              <div className="code-block">
                <SyntaxHighlighter
                  language="python"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                  }}
                >
                  {examples[currentExample].before}
                </SyntaxHighlighter>
              </div>
            </div>

            {/* After */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-600 dark:text-green-400">After Optimization</h4>
                <button
                  onClick={() => copyToClipboard(examples[currentExample].after, `after-${currentExample}`)}
                  className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {copiedStates[`after-${currentExample}`] ? (
                    <FiCheck className="text-green-500" />
                  ) : (
                    <FiCopy className="text-gray-500" />
                  )}
                </button>
              </div>
              <div className="code-block">
                <SyntaxHighlighter
                  language="python"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                  }}
                >
                  {examples[currentExample].after}
                </SyntaxHighlighter>
              </div>
            </div>
          </motion.div>

          {/* Metrics */}
          <motion.div
            key={`metrics-${currentExample}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 flex justify-center"
          >
            <div className="inline-flex items-center space-x-8 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Speed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {examples[currentExample].metrics.speed}
                </p>
              </div>
              <div className="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Memory</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {examples[currentExample].metrics.memory}
                </p>
              </div>
              <div className="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {examples[currentExample].metrics.accuracy}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CodeExamples;