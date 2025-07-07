import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright and links */}
          <div className="flex items-center space-x-6 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              © {currentYear} <a href="https://willynilsson.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400">Willy Nilsson</a>
            </span>
            <a href="https://github.com/willynilsson/deepoptimizer" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
              GitHub
            </a>
            <a href="https://willynilsson.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
              About Me
            </a>
          </div>
          
          {/* Social links */}
          <div className="flex items-center space-x-4">
            <motion.a
              href="https://github.com/willynilsson"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="GitHub"
            >
              <FiGithub size={20} />
            </motion.a>
            <motion.a
              href="https://x.com/WillyNilssonAI"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="Twitter"
            >
              <FiTwitter size={20} />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/willy-nilsson-243680252/?locale=en_US"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={20} />
            </motion.a>
            <motion.a
              href="mailto:inquiries@willynilsson.com"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="Email"
            >
              <FiMail size={20} />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;