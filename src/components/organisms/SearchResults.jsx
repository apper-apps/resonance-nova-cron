import React from 'react';
import { motion } from 'framer-motion';
import TrackCard from '@/components/molecules/TrackCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const SearchResults = ({ 
  results = [], 
  loading = false, 
  error = null, 
  onTrackSelect = () => {}, 
  onAddToQueue = () => {},
  query = ''
}) => {
  // Handle error state
  if (error) {
    return (
      <div className="w-full">
        <Error 
          message={error} 
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Handle loading state
  if (loading) {
    return (
      <div className="w-full">
        <Loading message="Searching for tracks..." />
      </div>
    );
  }

  // Handle empty results
  if (!results || results.length === 0) {
    return (
      <div className="w-full">
        <Empty 
          message={query ? `No results found for "${query}"` : "Enter a search term to find tracks"}
          icon="search"
        />
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Results header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          Search Results
          {query && <span className="text-gray-400 ml-2">for "{query}"</span>}
        </h2>
        <span className="text-sm text-gray-400">
          {results.length} {results.length === 1 ? 'result' : 'results'}
        </span>
      </div>

      {/* Results grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {results.map((track, index) => (
          <motion.div
            key={track?.id || index}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TrackCard
              track={track}
              onPlay={() => onTrackSelect?.(track)}
              onAddToQueue={() => onAddToQueue?.(track)}
              showAddToQueue={true}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SearchResults;