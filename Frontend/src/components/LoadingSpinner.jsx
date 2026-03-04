import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-green-700 font-medium"
      >
        AI is processing...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;