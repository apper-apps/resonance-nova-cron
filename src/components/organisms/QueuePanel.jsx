import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import TrackCard from '@/components/molecules/TrackCard';
import Empty from '@/components/ui/Empty';

const QueuePanel = ({ 
  queue, 
  currentTrack,
  isPlaying,
  onPlayTrack,
  onRemoveFromQueue,
  onClearQueue,
  className = '' 
}) => {
  if (!queue || queue.length === 0) {
    return (
      <motion.div
        className={`glass p-6 rounded-xl border border-white/10 ${className}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Empty 
          title="Queue is empty"
          description="Add tracks to your queue to see them here"
          icon="ListMusic"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`glass p-6 rounded-xl border border-white/10 ${className}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <ApperIcon name="ListMusic" size={20} className="mr-2" />
          Queue ({queue.length})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearQueue}
          className="text-error hover:text-error/80"
        >
          Clear All
        </Button>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {queue.map((track, index) => (
          <motion.div
            key={`${track.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative"
          >
            <TrackCard
              track={track}
              isPlaying={isPlaying && currentTrack?.id === track.id}
              onPlay={onPlayTrack}
              onAddToQueue={() => {}} // Disable add to queue for queue items
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFromQueue(index)}
              className="absolute top-2 right-2 text-error hover:text-error/80"
            >
              <ApperIcon name="X" size={14} />
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QueuePanel;