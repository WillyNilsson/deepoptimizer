import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  SparklesIcon, 
  LightBulbIcon,
  ArrowRightIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const featuredTechniques = [
  {
    icon: SparklesIcon,
    category: 'Advanced Optimizers',
    name: 'Lion Optimizer',
    description: 'Discovered through program search, uses sign updates for 15-20% memory reduction vs Adam',
    benefit: '15-20% less memory',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: LightBulbIcon,
    category: 'Efficient Attention',
    name: 'FlashAttention',
    description: 'IO-aware exact attention algorithm with fused operations for 2-4x speedup',
    benefit: '2-4x faster',
    color: 'from-green-500 to-teal-600'
  },
  {
    icon: AcademicCapIcon,
    category: 'Training Techniques',
    name: 'Mixed Precision',
    description: 'Use FP16/BF16 for computation while maintaining FP32 master weights',
    benefit: '2x memory savings',
    color: 'from-purple-500 to-pink-600'
  }
];

export default function LearningPreview() {
  return (
    <section id="learning-preview" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Learn ML Optimization Techniques
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore 70+ cutting-edge optimization techniques with interactive examples, 
            implementation guides, and research papers
          </p>
        </motion.div>

        {/* Featured Techniques Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {featuredTechniques.map((technique, index) => {
            const Icon = technique.icon;
            return (
              <motion.div
                key={technique.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                {/* Icon and Category */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${technique.color} bg-opacity-10`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {technique.category}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {technique.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {technique.description}
                </p>

                {/* Benefit Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs font-medium">
                  {technique.benefit}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">70+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Techniques</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">9</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">100+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Code Examples</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">50+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Research Papers</div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/learning">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <BookOpenIcon className="h-5 w-5 mr-2" />
              Explore All Techniques
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </motion.button>
          </Link>
          
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Interactive examples • Implementation guides • Compatibility matrices
          </p>
        </motion.div>
      </div>
    </section>
  );
}