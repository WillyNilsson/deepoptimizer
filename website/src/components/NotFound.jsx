import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-9xl font-bold gradient-text mb-4">404</h1>
        
        <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Page Not Found
        </h2>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Looks like this page failed its pre-flight check. 
          Let's get you back on course.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="button-primary flex items-center space-x-2"
            >
              <FiHome />
              <span>Back to Home</span>
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="button-secondary flex items-center space-x-2"
          >
            <FiArrowLeft />
            <span>Go Back</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;