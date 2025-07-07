import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpenIcon, 
  CodeBracketIcon, 
  LightBulbIcon,
  CpuChipIcon,
  SparklesIcon,
  BeakerIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AcademicCapIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const techniqueCategories = [
  {
    id: 'optimizers',
    name: 'Advanced Optimizers',
    icon: SparklesIcon,
    color: 'from-blue-500 to-indigo-600',
    description: 'State-of-the-art optimization algorithms beyond SGD and Adam',
    techniques: [
      {
        name: 'Lion Optimizer',
        description: 'Discovered through program search by Google Brain, uses sign updates like SignSGD',
        benefits: '15-20% memory reduction vs Adam, faster convergence',
        tradeoffs: 'Requires different LR scaling, less studied than Adam',
        code: `# PyTorch
from lion_pytorch import Lion
optimizer = Lion(model.parameters(), lr=1e-4, weight_decay=1e-2)

# Key differences from Adam:
# - Uses sign of gradient like SignSGD
# - Single momentum instead of two (Adam has beta1, beta2)
# - More memory efficient`,
        papers: ['https://arxiv.org/abs/2302.06675']
      },
      {
        name: 'Shampoo',
        description: 'Second-order optimizer that uses full preconditioning matrix',
        benefits: 'Better convergence, especially for ill-conditioned problems',
        tradeoffs: 'High memory cost, computational overhead',
        code: `# PyTorch (from pytorch-optimizer)
from torch_optimizer import Shampoo
optimizer = Shampoo(
    model.parameters(),
    lr=1e-3,
    eps=1e-10,
    update_freq=50  # Update preconditioner every N steps
)`,
        papers: ['https://arxiv.org/abs/1802.09568']
      },
      {
        name: 'LAMB (Layer-wise Adaptive Moments)',
        description: 'Extends LARS to Adam, enables large batch training',
        benefits: 'Train with batch sizes up to 64K without loss of accuracy',
        tradeoffs: 'Mainly beneficial for very large batch training',
        code: `# PyTorch
from torch_optimizer import Lamb
optimizer = Lamb(
    model.parameters(),
    lr=0.002,
    betas=(0.9, 0.999),
    weight_decay=0.01
)

# Particularly useful for:
# - Large batch distributed training
# - BERT-style pretraining`,
        papers: ['https://arxiv.org/abs/1904.00962']
      }
    ]
  },
  {
    id: 'distributed',
    name: 'Distributed Training',
    icon: CpuChipIcon,
    color: 'from-purple-500 to-pink-600',
    description: 'Techniques for training across multiple GPUs and nodes',
    techniques: [
      {
        name: 'ZeRO (Zero Redundancy Optimizer)',
        description: 'Eliminates memory redundancy in data parallel training',
        benefits: 'Train models 10x larger with same hardware',
        tradeoffs: 'Communication overhead, complexity',
        code: `# DeepSpeed ZeRO
import deepspeed

model_engine, optimizer, _, _ = deepspeed.initialize(
    model=model,
    config={
        "zero_optimization": {
            "stage": 3,  # ZeRO-3: partition params, grads, optimizer states
            "offload_optimizer": {"device": "cpu"},
            "offload_param": {"device": "cpu"},
            "overlap_comm": True,
            "contiguous_gradients": True
        }
    }
)`,
        papers: ['https://arxiv.org/abs/1910.02054']
      },
      {
        name: 'FSDP (Fully Sharded Data Parallel)',
        description: 'PyTorch native implementation of ZeRO-3',
        benefits: 'Native PyTorch support, easier integration',
        tradeoffs: 'Less mature than DeepSpeed, fewer features',
        code: `# PyTorch FSDP
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP

model = FSDP(
    model,
    sharding_strategy=ShardingStrategy.FULL_SHARD,
    cpu_offload=CPUOffload(offload_params=True),
    auto_wrap_policy=transformer_auto_wrap_policy,
    mixed_precision=MixedPrecision(
        param_dtype=torch.bfloat16,
        reduce_dtype=torch.bfloat16,
        buffer_dtype=torch.bfloat16
    )
)`,
        papers: ['https://arxiv.org/abs/2304.11277']
      },
      {
        name: 'Pipeline Parallelism',
        description: 'Splits model layers across devices, processes micro-batches in pipeline',
        benefits: 'Enables training of models that don\'t fit on one GPU',
        tradeoffs: 'Pipeline bubbles reduce efficiency, complex to implement',
        code: `# PyTorch Pipeline Parallel
from torch.distributed.pipeline.sync import Pipe

# Split model into stages
model = nn.Sequential(
    stage1_layers,  # On GPU 0
    stage2_layers,  # On GPU 1
    stage3_layers   # On GPU 2
)

model = Pipe(model, balance=[2, 3, 3], devices=[0, 1, 2])`,
        papers: ['https://arxiv.org/abs/1811.06965']
      }
    ]
  },
  {
    id: 'attention',
    name: 'Efficient Attention',
    icon: LightBulbIcon,
    color: 'from-green-500 to-teal-600',
    description: 'Memory and compute efficient attention mechanisms',
    techniques: [
      {
        name: 'FlashAttention',
        description: 'IO-aware exact attention algorithm, fuses operations to reduce memory access',
        benefits: '2-4x faster, 10-20x memory reduction',
        tradeoffs: 'Requires specific hardware (A100, H100), custom kernels',
        code: `# FlashAttention-2
from flash_attn import flash_attn_func

# Replace standard attention
attn_output = flash_attn_func(
    q, k, v,
    dropout_p=0.1,
    causal=True,  # For autoregressive models
    window_size=(-1, -1)  # Local attention window
)

# In transformers
from transformers import AutoModel
model = AutoModel.from_pretrained(
    "model_name",
    attn_implementation="flash_attention_2"
)`,
        papers: ['https://arxiv.org/abs/2205.14135', 'https://arxiv.org/abs/2307.08691']
      },
      {
        name: 'Multi-Query Attention (MQA)',
        description: 'Shares key and value projections across attention heads',
        benefits: '~30% memory reduction, faster inference',
        tradeoffs: 'Slight accuracy drop, requires retraining',
        code: `# PyTorch implementation
class MultiQueryAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.n_heads = n_heads
        self.d_head = d_model // n_heads
        
        # Multiple query heads, single K/V
        self.q_proj = nn.Linear(d_model, d_model)
        self.k_proj = nn.Linear(d_model, self.d_head)  # Single head
        self.v_proj = nn.Linear(d_model, self.d_head)  # Single head
        
    def forward(self, x):
        B, T, C = x.shape
        q = self.q_proj(x).view(B, T, self.n_heads, self.d_head)
        k = self.k_proj(x).view(B, T, 1, self.d_head)
        v = self.v_proj(x).view(B, T, 1, self.d_head)
        
        # Expand k, v to match q heads
        k = k.expand(-1, -1, self.n_heads, -1)
        v = v.expand(-1, -1, self.n_heads, -1)`,
        papers: ['https://arxiv.org/abs/1911.02150']
      },
      {
        name: 'Grouped Query Attention (GQA)',
        description: 'Interpolates between MHA and MQA by grouping heads',
        benefits: 'Better quality than MQA, still saves memory',
        tradeoffs: 'More complex than MQA',
        code: `# GQA with 4 groups for 16 heads
class GroupedQueryAttention(nn.Module):
    def __init__(self, d_model, n_heads, n_groups):
        super().__init__()
        self.n_heads = n_heads
        self.n_groups = n_groups
        self.heads_per_group = n_heads // n_groups
        
        self.q_proj = nn.Linear(d_model, d_model)
        self.k_proj = nn.Linear(d_model, d_model // (n_heads // n_groups))
        self.v_proj = nn.Linear(d_model, d_model // (n_heads // n_groups))`,
        papers: ['https://arxiv.org/abs/2305.13245']
      }
    ]
  },
  {
    id: 'quantization',
    name: 'Quantization & Precision',
    icon: BeakerIcon,
    color: 'from-orange-500 to-red-600',
    description: 'Reduce model size and increase speed with lower precision',
    techniques: [
      {
        name: 'INT8 Quantization',
        description: 'Quantize weights and activations to 8-bit integers',
        benefits: '4x model size reduction, 2-4x speedup',
        tradeoffs: 'Small accuracy loss, requires calibration',
        code: `# PyTorch Dynamic Quantization
import torch.quantization as quant

# Dynamic quantization (easiest, for inference)
model_int8 = quant.quantize_dynamic(
    model,
    {nn.Linear, nn.Conv2d},  # Layers to quantize
    dtype=torch.qint8
)

# Static quantization (more complex, better performance)
model.qconfig = quant.get_default_qconfig('fbgemm')
quant.prepare(model, inplace=True)
# Run calibration
quant.convert(model, inplace=True)`,
        papers: ['https://arxiv.org/abs/1712.05877']
      },
      {
        name: 'GPTQ (Accurate Post-training Quantization)',
        description: 'Layer-wise quantization that minimizes reconstruction error',
        benefits: '3-4 bit quantization with minimal accuracy loss',
        tradeoffs: 'Slow quantization process, inference overhead',
        code: `# Using AutoGPTQ
from auto_gptq import AutoGPTQForCausalLM, BaseQuantizeConfig

quantize_config = BaseQuantizeConfig(
    bits=4,
    group_size=128,
    desc_act=False
)

model = AutoGPTQForCausalLM.from_pretrained(
    model_name,
    quantize_config=quantize_config
)

# Quantize with calibration data
model.quantize(calibration_dataset)`,
        papers: ['https://arxiv.org/abs/2210.17323']
      },
      {
        name: 'SmoothQuant',
        description: 'Smooths activation outliers to enable INT8 quantization for LLMs',
        benefits: 'Enables INT8 for models like OPT-175B',
        tradeoffs: 'Requires offline statistics collection',
        code: `# SmoothQuant migration
from smoothquant import smooth_lm

# Collect activation statistics
act_scales = get_activation_scales(model, calibration_data)

# Apply smoothing
smooth_lm(model, act_scales, alpha=0.5)

# Now can apply INT8 quantization
model = quantize_int8(model)`,
        papers: ['https://arxiv.org/abs/2211.10438']
      }
    ]
  },
  {
    id: 'training',
    name: 'Training Techniques',
    icon: AcademicCapIcon,
    color: 'from-cyan-500 to-blue-600',
    description: 'Advanced training strategies for better convergence and efficiency',
    techniques: [
      {
        name: 'Gradient Accumulation',
        description: 'Simulate larger batch sizes by accumulating gradients',
        benefits: 'Train with large effective batch sizes on limited memory',
        tradeoffs: 'Slower training, need to adjust LR schedule',
        code: `# PyTorch gradient accumulation
accumulation_steps = 4
optimizer.zero_grad()

for i, (inputs, labels) in enumerate(dataloader):
    outputs = model(inputs)
    loss = criterion(outputs, labels)
    loss = loss / accumulation_steps  # Normalize loss
    loss.backward()
    
    if (i + 1) % accumulation_steps == 0:
        optimizer.step()
        optimizer.zero_grad()`,
        papers: []
      },
      {
        name: 'Mixed Precision Training',
        description: 'Use FP16/BF16 for computations, FP32 for master weights',
        benefits: '2x memory reduction, 2-3x speedup on modern GPUs',
        tradeoffs: 'Potential numerical instability, requires loss scaling',
        code: `# PyTorch Automatic Mixed Precision
from torch.cuda.amp import autocast, GradScaler

scaler = GradScaler()

for inputs, labels in dataloader:
    optimizer.zero_grad()
    
    with autocast(dtype=torch.float16):
        outputs = model(inputs)
        loss = criterion(outputs, labels)
    
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()`,
        papers: ['https://arxiv.org/abs/1710.03740']
      },
      {
        name: 'Gradient Checkpointing',
        description: 'Trade compute for memory by recomputing activations',
        benefits: 'Train 2-3x larger models with same memory',
        tradeoffs: '20-30% slower training',
        code: `# PyTorch checkpoint
from torch.utils.checkpoint import checkpoint

class CheckpointedModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.blocks = nn.ModuleList([Block() for _ in range(24)])
    
    def forward(self, x):
        for block in self.blocks:
            x = checkpoint(block, x)  # Recompute in backward
        return x

# For transformers
model.gradient_checkpointing_enable()`,
        papers: ['https://arxiv.org/abs/1604.06174']
      }
    ]
  }
];

const conflictingPairs = [
  {
    technique1: 'Mixed Precision Training',
    technique2: 'Quantization',
    reason: 'Both modify numerical precision, can compound accuracy loss'
  },
  {
    technique1: 'Gradient Checkpointing',
    technique2: 'Pipeline Parallelism',
    reason: 'Both add memory/compute trade-offs that can conflict'
  },
  {
    technique1: 'FSDP',
    technique2: 'Pipeline Parallelism',
    reason: 'Different parallelism strategies that are complex to combine'
  }
];

const synergyPairs = [
  {
    technique1: 'Mixed Precision Training',
    technique2: 'Gradient Accumulation',
    reason: 'Both help fit larger models/batches in memory'
  },
  {
    technique1: 'FlashAttention',
    technique2: 'Mixed Precision Training',
    reason: 'FlashAttention has built-in FP16/BF16 support'
  },
  {
    technique1: 'ZeRO',
    technique2: 'Gradient Checkpointing',
    reason: 'Complementary memory saving techniques'
  }
];

export default function Learning() {
  const [selectedCategory, setSelectedCategory] = useState(techniqueCategories[0]);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [showConflicts, setShowConflicts] = useState(false);
  const [expandedCode, setExpandedCode] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = techniqueCategories.map(category => ({
    ...category,
    techniques: category.techniques.filter(technique =>
      technique.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technique.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.techniques.length > 0);

  const toggleCodeExpansion = (techniqueName) => {
    setExpandedCode(prev => ({
      ...prev,
      [techniqueName]: !prev[techniqueName]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            ML Optimization Learning Center
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore cutting-edge ML optimization techniques with interactive examples,
            implementation details, and compatibility guidelines
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <input
            type="text"
            placeholder="Search techniques..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto block px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {techniqueCategories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory.id === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedTechnique(null);
                }}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-lg' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Conflict/Synergy Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <button
            onClick={() => setShowConflicts(!showConflicts)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <DocumentTextIcon className="h-5 w-5" />
            <span>{showConflicts ? 'Hide' : 'Show'} Technique Relationships</span>
            {showConflicts ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </button>
        </motion.div>

        {/* Conflicts/Synergies Display */}
        <AnimatePresence>
          {showConflicts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Conflicts */}
              <div className="bg-gray-800 rounded-lg p-6 border border-red-900">
                <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  Conflicting Techniques
                </h3>
                <div className="space-y-3">
                  {conflictingPairs.map((pair, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="flex items-center text-gray-300">
                        <span className="font-medium">{pair.technique1}</span>
                        <span className="mx-2 text-red-500">⚔️</span>
                        <span className="font-medium">{pair.technique2}</span>
                      </div>
                      <p className="text-gray-500 mt-1">{pair.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Synergies */}
              <div className="bg-gray-800 rounded-lg p-6 border border-green-900">
                <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Synergistic Techniques
                </h3>
                <div className="space-y-3">
                  {synergyPairs.map((pair, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="flex items-center text-gray-300">
                        <span className="font-medium">{pair.technique1}</span>
                        <span className="mx-2 text-green-500">🤝</span>
                        <span className="font-medium">{pair.technique2}</span>
                      </div>
                      <p className="text-gray-500 mt-1">{pair.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Techniques List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-white mb-4">
              {selectedCategory.name}
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              {selectedCategory.description}
            </p>
            <div className="space-y-3">
              {selectedCategory.techniques.map((technique, idx) => (
                <motion.button
                  key={technique.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedTechnique(technique)}
                  className={`
                    w-full text-left p-4 rounded-lg transition-all
                    ${selectedTechnique?.name === technique.name
                      ? 'bg-gradient-to-r ' + selectedCategory.color + ' text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }
                  `}
                >
                  <h3 className="font-medium mb-1">{technique.name}</h3>
                  <p className="text-sm opacity-80 line-clamp-2">
                    {technique.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Technique Details */}
          <div className="lg:col-span-2">
            {selectedTechnique ? (
              <motion.div
                key={selectedTechnique.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-lg p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-4">
                  {selectedTechnique.name}
                </h2>
                
                <p className="text-gray-300 mb-6">
                  {selectedTechnique.description}
                </p>

                {/* Benefits & Tradeoffs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                    <h3 className="text-green-400 font-semibold mb-2 flex items-center">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Benefits
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {selectedTechnique.benefits}
                    </p>
                  </div>
                  
                  <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
                    <h3 className="text-yellow-400 font-semibold mb-2 flex items-center">
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      Tradeoffs
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {selectedTechnique.tradeoffs}
                    </p>
                  </div>
                </div>

                {/* Implementation Code */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <CodeBracketIcon className="h-5 w-5 mr-2" />
                      Implementation
                    </h3>
                    <button
                      onClick={() => toggleCodeExpansion(selectedTechnique.name)}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                    >
                      {expandedCode[selectedTechnique.name] ? 'Collapse' : 'Expand'}
                      {expandedCode[selectedTechnique.name] ? 
                        <ChevronUpIcon className="h-4 w-4 ml-1" /> : 
                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                      }
                    </button>
                  </div>
                  <div className={`
                    bg-gray-900 rounded-lg p-4 overflow-hidden transition-all
                    ${expandedCode[selectedTechnique.name] ? '' : 'max-h-64'}
                  `}>
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{selectedTechnique.code}</code>
                    </pre>
                  </div>
                </div>

                {/* Research Papers */}
                {selectedTechnique.papers?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      Research Papers
                    </h3>
                    <div className="space-y-2">
                      {selectedTechnique.papers.map((paper, idx) => (
                        <a
                          key={idx}
                          href={paper}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                        >
                          <ArrowRightIcon className="h-4 w-4 mr-2" />
                          {paper}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800 rounded-lg p-8 text-center"
              >
                <BookOpenIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  Select a technique to view detailed implementation and usage information
                </p>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}