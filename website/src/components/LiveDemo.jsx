import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiLoader, FiCheck, FiAlertCircle } from 'react-icons/fi';

const LiveDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedModel, setSelectedModel] = useState('transformer');

  const models = {
    transformer: {
      name: 'Transformer Model',
      file: 'transformer.py',
      optimizations: [
        { name: 'Flash Attention 2.0', improvement: '+3.2x speed', memory: '-45%' },
        { name: 'Gradient Checkpointing', improvement: '+1.5x batch size', memory: '-35%' },
        { name: 'Mixed Precision Training', improvement: '+2.1x speed', memory: '-50%' },
      ],
    },
    cnn: {
      name: 'CNN Model',
      file: 'resnet50.py',
      optimizations: [
        { name: 'Depthwise Separable Convolutions', improvement: '+1.8x speed', memory: '-30%' },
        { name: 'Knowledge Distillation', improvement: '+2.5x inference', memory: '-60%' },
        { name: 'Quantization-Aware Training', improvement: '+4x speed', memory: '-75%' },
      ],
    },
    gan: {
      name: 'GAN Model',
      file: 'stylegan2.py',
      optimizations: [
        { name: 'Progressive Growing', improvement: '+2x training speed', memory: '-40%' },
        { name: 'Adaptive Discriminator Augmentation', improvement: '+1.3x quality', memory: '-20%' },
        { name: 'Lazy Regularization', improvement: '+1.7x speed', memory: '-15%' },
      ],
    },
  };

  const steps = [
    { status: 'analyzing', message: 'Analyzing model architecture...' },
    { status: 'searching', message: 'Searching knowledge graph for optimizations...' },
    { status: 'validating', message: 'Validating compatibility and benchmarks...' },
    { status: 'complete', message: 'Analysis complete! Found optimizations:' },
  ];

  useEffect(() => {
    if (isRunning && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
 
  }, [isRunning, currentStep]);

  const runDemo = () => {
    setIsRunning(true);
    setCurrentStep(0);
  };

  const resetDemo = () => {
    setIsRunning(false);
    setCurrentStep(0);
  };

  return (
    <section id="demo" className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-850 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See DeepOptimizer in{' '}
            <span className="gradient-text">Action</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Watch how DeepOptimizer analyzes different model architectures and suggests 
            tailored optimizations based on extensive research.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Model Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Select a Model Architecture
            </h3>
            
            <div className="space-y-4 mb-6">
              {Object.entries(models).map(([key, model]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !isRunning && setSelectedModel(key)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedModel === key
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{model.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{model.file}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedModel === key
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedModel === key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-full h-full rounded-full bg-white flex items-center justify-center"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={currentStep === steps.length - 1 ? resetDemo : runDemo}
              disabled={isRunning && currentStep < steps.length - 1}
              className={`button-primary w-full flex items-center justify-center space-x-2 ${
                isRunning && currentStep < steps.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <span>Reset Demo</span>
                </>
              ) : isRunning ? (
                <>
                  <FiLoader className="animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <FiPlay />
                  <span>Run Analysis</span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Terminal Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center space-x-2 px-4 py-3 bg-gray-800">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-gray-400 text-sm">deepoptimizer terminal</span>
            </div>
            
            <div className="p-6 font-mono text-sm h-96 overflow-y-auto">
              <div className="text-green-400">
                $ deepoptimizer analyze --file {models[selectedModel].file}
              </div>
              
              <AnimatePresence>
                {isRunning && steps.slice(0, currentStep + 1).map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <div className="flex items-start space-x-2">
                      {step.status === 'complete' ? (
                        <FiCheck className="text-green-400 mt-1 flex-shrink-0" />
                      ) : step.status === 'analyzing' || step.status === 'searching' || step.status === 'validating' ? (
                        <FiLoader className="text-blue-400 mt-1 animate-spin flex-shrink-0" />
                      ) : (
                        <FiAlertCircle className="text-yellow-400 mt-1 flex-shrink-0" />
                      )}
                      <span className={
                        step.status === 'complete' ? 'text-green-400' :
                        step.status === 'analyzing' ? 'text-blue-400' :
                        step.status === 'searching' ? 'text-purple-400' :
                        'text-yellow-400'
                      }>
                        {step.message}
                      </span>
                    </div>
                    
                    {step.status === 'complete' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 space-y-3 ml-6"
                      >
                        {models[selectedModel].optimizations.map((opt, optIndex) => (
                          <motion.div
                            key={optIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + optIndex * 0.2 }}
                            className="text-gray-300"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-yellow-400">→ {opt.name}</span>
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="text-green-400">{opt.improvement}</span>
                                <span className="text-blue-400">{opt.memory}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.5 }}
                          className="mt-6 pt-4 border-t border-gray-700"
                        >
                          <p className="text-gray-400">
                            Generated report saved to: <span className="text-white">optimization_report.md</span>
                          </p>
                          <p className="text-gray-400 mt-1">
                            Review the report and implement the suggested optimizations in your code.
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {!isRunning && currentStep === 0 && (
                <div className="text-gray-600 mt-4">
                  <p>Ready to analyze {models[selectedModel].name}...</p>
                  <p className="mt-2">Click "Run Analysis" to start the optimization process.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;