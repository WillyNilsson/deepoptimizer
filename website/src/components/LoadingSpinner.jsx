import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 rounded-full" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 dark:border-primary-400 rounded-full border-t-transparent" />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;