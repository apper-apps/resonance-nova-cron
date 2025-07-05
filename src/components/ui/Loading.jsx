import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ className = '' }) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="text-gray-400 text-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Loading music...
      </motion.p>
      
      {/* Skeleton cards */}
      <div className="w-full max-w-md mt-8 space-y-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="flex items-center space-x-4 p-4 glass rounded-xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="w-16 h-16 bg-surface/50 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface/50 rounded animate-pulse" />
              <div className="h-3 bg-surface/30 rounded animate-pulse w-3/4" />
            </div>
            <div className="w-12 h-8 bg-surface/50 rounded animate-pulse" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Loading;