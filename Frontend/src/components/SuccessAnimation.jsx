import { motion } from 'framer-motion';
import { useEffect } from 'react';

const SuccessAnimation = ({ message, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-green-200 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
        <h3 className="text-xl font-semibold text-green-700 mb-2">Success!</h3>
        <p className="text-gray-600">{message}</p>
      </motion.div>
    </motion.div>
  );
};

export default SuccessAnimation;