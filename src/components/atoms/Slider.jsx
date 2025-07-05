import React from 'react';
import { motion } from 'framer-motion';

const Slider = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  className = '',
  ...props 
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative h-2 bg-surface/50 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          style={{ width: `${percentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
        {...props}
      />
      <motion.div
        className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 cursor-pointer"
        style={{ left: `${percentage}%` }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      />
    </div>
  );
};

export default Slider;