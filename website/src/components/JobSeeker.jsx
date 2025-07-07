import { motion } from 'framer-motion';
import { FiHeart, FiCode, FiUsers, FiTarget } from 'react-icons/fi';

const JobSeeker = () => {
  const interests = [
    {
      icon: FiCode,
      title: 'Developer Tools',
      description: 'Passionate about building AI-powered tools that make developers more productive and help them write better code.',
    },
    {
      icon: FiHeart,
      title: 'Open Source',
      description: 'Believe in the power of open collaboration to advance AI and make powerful tools accessible to everyone.',
    },
    {
      icon: FiUsers,
      title: 'Research to Practice',
      description: 'Excited about bridging the gap between cutting-edge research and practical engineering applications.',
    },
    {
      icon: FiTarget,
      title: 'Impact at Scale',
      description: 'Want to work on tools that can help millions of developers build better AI systems more efficiently.',
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50/50 via-primary-50/20 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Looking to Make an <span className="gradient-text">Impact</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Seeking opportunities to build AI-powered developer tools at leading AI labs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Personal message */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="card">
              <h3 className="text-2xl font-semibold mb-4">Why AI Developer Tools?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                After building DeepOptimizer, I realized that the intersection of AI and developer 
                experience is where I want to focus my career. The potential to augment human 
                creativity and productivity with AI is enormous.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                I believe the next generation of developer tools will be AI-native, helping engineers 
                navigate the increasing complexity of modern software development. From intelligent 
                analysis to optimization suggestions, from debugging to documentation, AI can be a true co-pilot.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                If your team is building the future of AI-powered development tools, I'd love to 
                contribute my skills in full-stack development, ML engineering, and product thinking 
                to help make that vision a reality.
              </p>
            </div>
          </motion.div>

          {/* Right side - What I'm looking for */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            {interests.map((interest, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <interest.icon className="text-primary-600 dark:text-primary-400" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {interest.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {interest.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Currently based in Stockholm, open to relocation for the right opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="https://www.linkedin.com/in/willy-nilsson-243680252/?locale=en_US"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="button-primary"
            >
              Connect on LinkedIn
            </motion.a>
            <motion.a
              href="mailto:inquiries@willynilsson.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="button-secondary"
            >
              Send an Email
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JobSeeker;