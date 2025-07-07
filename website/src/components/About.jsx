import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiHeart, FiCode, FiUsers, FiTarget } from 'react-icons/fi';

const About = () => {
  const team = [
    {
      name: 'Willy Nilsson',
      role: 'Creator & Developer',
      bio: 'Fullstack developer and author of "How to Win a Lost Game"',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Willy',
      links: {
        github: 'https://github.com/willynilsson',
        twitter: 'https://twitter.com/willynilsson',
        linkedin: 'https://linkedin.com/in/willynilsson',
      },
    },
  ];

  const stats = [
    { number: '10+', label: 'Core Techniques Implemented' },
    { number: '99.3%', label: 'Demo Model Size Reduction' },
    { number: '4.7x', label: 'Demo Speed Improvement' },
    { number: '100%', label: 'Open Source' },
  ];

  return (
    <section id="about" className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="gradient-text">DeepOptimizer</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            An AI-powered tool that analyzes ML code for bugs and optimization opportunities.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="card max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 gradient-text">The Idea</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              DeepOptimizer was inspired by a simple insight from psychology: pilots use checklists 
              because even experts benefit from systematic checks in complex environments. ML development 
              has similar complexity - this tool provides those systematic checks for ML code.
            </p>
          </div>
        </motion.div>

        {/* Looking to Make an Impact section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Looking to Make an <span className="gradient-text">Impact</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left side - Personal bio */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="card">
                <h3 className="text-2xl font-semibold mb-4">About Me</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  I'm Willy Nilsson, with a background in psychology and programming. The aviation 
                  checklist concept came from studying how complex systems benefit from systematic verification.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Currently seeking opportunities in AI/ML tooling development at leading labs.
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
              {[
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
              ].map((interest, index) => (
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
                href="https://linkedin.com/in/willynilsson"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="button-primary"
              >
                Connect on LinkedIn
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;