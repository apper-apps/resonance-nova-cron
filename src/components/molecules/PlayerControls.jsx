import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const PlayerControls = ({ 
  isPlaying, 
  onPlayPause, 
  onPrevious, 
  onNext,
  canGoPrevious = true,
  canGoNext = true,
  className = '' 
}) => {
  return (
    <motion.div
      className={`flex items-center justify-center space-x-4 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="text-white hover:text-primary"
      >
        <ApperIcon name="SkipBack" size={20} />
      </Button>
      
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          variant="primary"
          size="lg"
          onClick={onPlayPause}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary neon-glow"
        >
          <ApperIcon name={isPlaying ? "Pause" : "Play"} size={24} />
        </Button>
      </motion.div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={!canGoNext}
        className="text-white hover:text-primary"
      >
        <ApperIcon name="SkipForward" size={20} />
      </Button>
    </motion.div>
  );
};

export default PlayerControls;