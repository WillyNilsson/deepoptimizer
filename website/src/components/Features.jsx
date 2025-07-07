import { motion } from 'framer-motion';
import { 
  FiCpu, FiDatabase, FiZap, FiTarget, 
  FiTrendingUp, FiShield, FiBook, FiGitBranch 
} from 'react-icons/fi';

const Features = () => {
  const features = [
    {
      icon: FiCpu,
      title: 'Gemini-Powered Analysis',
      description: 'Uses Google\'s Gemini AI to provide deep, context-aware analysis of your ML code beyond simple pattern matching.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FiDatabase,
      title: '70+ ML Techniques',
      description: 'Knowledge base of optimization techniques from research papers with conflicts, synergies, and implementation details.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: FiZap,
      title: 'Rule-Based Detection',
      description: 'Fast detection of common ML bugs like missing model.eval(), memory leaks, and wrong loss functions.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: FiTarget,
      title: 'Severity Levels',
      description: 'Issues categorized as errors, warnings, or suggestions to help you prioritize critical fixes.',
      gradient: 'from-green-500 to-teal-500',
    },
    {
      icon: FiTrendingUp,
      title: 'Beautiful CLI Output',
      description: 'Rich terminal output with colors, progress bars, and multiple export formats (JSON, Markdown).',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: FiShield,
      title: 'Free & Private',
      description: 'Completely free - just bring your own Gemini API key. Your code never leaves your machine.',
      gradient: 'from-red-500 to-pink-500',
    },
    {
      icon: FiBook,
      title: 'Research-Backed',
      description: 'Every optimization suggestion includes references to original papers and real code examples.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: FiGitBranch,
      title: 'Easy Installation',
      description: 'Simple pip install and you\'re ready to analyze. Works with any Python ML/DL codebase.',
      gradient: 'from-cyan-500 to-blue-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="features" className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for{' '}
            <span className="gradient-text">ML Researchers</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A free CLI tool that combines fast rule-based detection with Gemini AI insights
            to help you optimize your ML models. Just pip install and start analyzing.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative group"
            >
              <div className="card h-full flex flex-col">
                {/* Icon container */}
                <div className="mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} p-3 text-white`}>
                    <feature.icon size={24} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 flex-grow">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                     style={{
                       backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                       '--tw-gradient-from': feature.gradient.split(' ')[1],
                       '--tw-gradient-to': feature.gradient.split(' ')[3],
                     }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: '70+', label: 'ML Techniques' },
            { number: '15+', label: 'Bug Detectors' },
            { number: '3', label: 'Severity Levels' },
            { number: '100%', label: 'Open Source' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="text-4xl md:text-5xl font-bold gradient-text mb-2"
              >
                {stat.number}
              </motion.div>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;