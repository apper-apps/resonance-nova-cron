import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Empty = ({ 
  title = "No content found", 
  description = "There's nothing here yet.", 
  icon = "Search",
  actionText,
  onAction,
  className = '' 
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-20 h-20 bg-surface/50 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ApperIcon name={icon} size={40} className="text-gray-400" />
      </motion.div>
      
      <motion.h3
        className="text-xl font-bold text-white mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {title}
      </motion.h3>
      
      <motion.p
        className="text-gray-400 mb-6 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {description}
      </motion.p>
      
      {actionText && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            variant="primary"
            onClick={onAction}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>{actionText}</span>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Empty;