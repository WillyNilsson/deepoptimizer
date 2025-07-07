import { motion } from 'framer-motion';
import { FiArrowRight, FiGithub, FiZap, FiCode } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Optimize', 'Accelerate', 'Transform', 'Enhance'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-gray-50/30 to-white dark:from-gray-900 dark:via-gray-850 dark:to-gray-800">

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-8"
          >
            <FiZap className="animate-pulse" />
            <span>CLI Tool with Gemini-powered Analysis</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Pre-flight Checks for
            <br />
            <span className="gradient-text">ML Code</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Inspired by how pilots use checklists to ensure safety. 
            Automated analysis for PyTorch models before training - catch issues 
            and discover optimizations from 55+ research-backed techniques.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.a
              href="#demo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="button-primary flex items-center justify-center space-x-2"
            >
              <span>Try the Demo</span>
              <FiArrowRight />
            </motion.a>
            
            <motion.a
              href="https://github.com/willynilsson/deepoptimizer"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="button-secondary flex items-center justify-center space-x-2"
            >
              <FiGithub />
              <span>View on GitHub</span>
            </motion.a>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { icon: FiCode, text: '70+ ML Techniques', highlight: '70+' },
              { icon: FiZap, text: 'Free with Your API Key', highlight: 'Free' },
              { icon: FiGithub, text: '100% Open Source', highlight: '100%' },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="flex items-center justify-center space-x-3 text-gray-700 dark:text-gray-300"
              >
                <item.icon className="text-primary-600 dark:text-primary-400" size={24} />
                <span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">{item.highlight}</span>{' '}
                  {item.text.replace(item.highlight, '')}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Animated code window preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 blur-3xl opacity-20"></div>
          <div className="relative bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center space-x-2 px-4 py-3 bg-gray-800">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-gray-400 text-sm">terminal - zsh</span>
            </div>
            <div className="p-6 font-mono text-sm">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="text-green-400"
              >
                $ pip install deepoptimizer
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="text-gray-400 mt-2"
              >
                $ export GEMINI_API_KEY="your-api-key"
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.5 }}
                className="text-green-400 mt-2"
              >
                $ deepoptimizer analyze model.py
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.1, duration: 0.5 }}
                className="text-blue-400 mt-2"
              >
                🔍 DeepOptimizer Analysis Results
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4, duration: 0.5 }}
                className="text-red-400"
              >
                🚨 CRITICAL: Missing model.eval() in validation
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.7, duration: 0.5 }}
                className="text-yellow-400"
              >
                ⚠️  WARNING: Small batch size limiting GPU usage
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;