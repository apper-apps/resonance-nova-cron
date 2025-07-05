import React from 'react';
import { motion } from 'framer-motion';
import TrackCard from '@/components/molecules/TrackCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const SearchResults = ({ 
  tracks, 
  loading, 
  error, 
  currentTrack,
  isPlaying,
  onPlayTrack,
  onAddToQueue,
  onRetry,
  className = '' 
}) => {
  if (loading) {
    return <Loading className={className} />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={onRetry} 
        className={className}
      />
    );
  }

  if (!tracks || tracks.length === 0) {
    return (
      <Empty 
        title="No tracks found"
        description="Try searching for different artists or songs"
        className={className}
      />
    );
  }

  return (
    <motion.div
      className={`space-y-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-2xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Search Results
      </motion.h2>
      
      <div className="grid gap-4">
        {tracks.map((track, index) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <TrackCard
              track={track}
              isPlaying={isPlaying && currentTrack?.id === track.id}
              onPlay={onPlayTrack}
              onAddToQueue={onAddToQueue}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchResults;