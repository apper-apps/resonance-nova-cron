import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TrackCard = ({ 
  track, 
  isPlaying = false, 
  onPlay, 
  onAddToQueue,
  className = '' 
}) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className={`glass p-4 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={track.albumArt}
            alt={track.album}
            className="w-16 h-16 rounded-lg object-cover"
          />
          {isPlaying && (
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-lg flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ApperIcon name="Volume2" size={20} className="text-primary" />
              </motion.div>
            </motion.div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{track.title}</h3>
          <p className="text-gray-400 text-sm truncate">{track.artist}</p>
          <p className="text-gray-500 text-xs truncate">{track.album}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">{formatDuration(track.duration)}</span>
          <Button
            variant="icon"
            size="icon"
            onClick={() => onPlay(track)}
            className="neon-glow"
          >
            <ApperIcon name={isPlaying ? "Pause" : "Play"} size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAddToQueue(track)}
          >
            <ApperIcon name="Plus" size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TrackCard;