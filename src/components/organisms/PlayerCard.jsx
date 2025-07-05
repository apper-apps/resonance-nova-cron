import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import PlayerControls from '@/components/molecules/PlayerControls';
import VolumeControl from '@/components/molecules/VolumeControl';
import Slider from '@/components/atoms/Slider';

const PlayerCard = ({ 
  currentTrack, 
  isPlaying, 
  currentTime, 
  duration, 
  volume,
  onPlayPause,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  className = '' 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return (
      <motion.div
        className={`glass p-8 rounded-2xl border border-white/10 text-center max-w-md mx-auto ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <div className="w-32 h-32 mx-auto bg-surface/50 rounded-full flex items-center justify-center">
            <ApperIcon name="Music" size={48} className="text-gray-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">No Track Selected</h2>
            <p className="text-gray-400">Search for music to get started</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`glass p-8 rounded-2xl border border-white/10 backdrop-blur-xl max-w-md mx-auto ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        {/* Album Art */}
        <motion.div
          className="relative mx-auto w-48 h-48 rounded-2xl overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={currentTrack.albumArt}
            alt={currentTrack.album}
            className="w-full h-full object-cover"
          />
          {isPlaying && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Track Info */}
        <div className="text-center space-y-2">
          <motion.h2
            className="text-2xl font-bold text-white truncate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {currentTrack.title}
          </motion.h2>
          <motion.p
            className="text-gray-400 text-lg truncate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {currentTrack.artist}
          </motion.p>
          <motion.p
            className="text-gray-500 truncate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {currentTrack.album}
          </motion.p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            min={0}
            max={duration}
            step={1}
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <VolumeControl
            volume={volume}
            onVolumeChange={onVolumeChange}
          />
          
          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={onPlayPause}
            onPrevious={onPrevious}
            onNext={onNext}
          />
          
          <div className="w-12"> {/* Spacer for symmetry */}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerCard;