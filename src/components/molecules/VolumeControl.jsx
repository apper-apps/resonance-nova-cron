import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Slider from '@/components/atoms/Slider';

const VolumeControl = ({ volume, onVolumeChange, className = '' }) => {
  const [showSlider, setShowSlider] = useState(false);

  const getVolumeIcon = () => {
    if (volume === 0) return 'VolumeX';
    if (volume < 50) return 'Volume1';
    return 'Volume2';
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowSlider(!showSlider)}
        className="text-white hover:text-primary"
      >
        <ApperIcon name={getVolumeIcon()} size={20} />
      </Button>
      
      {showSlider && (
        <motion.div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-4 glass rounded-xl border border-white/10"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-32 h-4 flex items-center">
            <Slider
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              min={0}
              max={100}
              step={1}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VolumeControl;