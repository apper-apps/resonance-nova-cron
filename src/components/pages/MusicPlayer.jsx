import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ParticleCanvas from '@/components/organisms/ParticleCanvas';
import PlayerCard from '@/components/organisms/PlayerCard';
import SearchBar from '@/components/molecules/SearchBar';
import SearchResults from '@/components/organisms/SearchResults';
import QueuePanel from '@/components/organisms/QueuePanel';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { musicService } from '@/services/api/musicService';

const MusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [queue, setQueue] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQueue, setShowQueue] = useState(false);

  // Simulate audio playback
  useEffect(() => {
    let interval;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, duration]);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const results = await musicService.searchTracks(query);
      setSearchResults(results);
      toast.success(`Found ${results.length} tracks`);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to search tracks');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track) => {
    setCurrentTrack(track);
    setDuration(track.duration);
    setCurrentTime(0);
    setIsPlaying(true);
    toast.success(`Now playing: ${track.title}`);
  };

  const handlePlayPause = () => {
    if (!currentTrack) {
      toast.warn('No track selected');
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (queue.length > 0) {
      const previousTrack = queue[queue.length - 1];
      setQueue(prev => prev.slice(0, -1));
      handlePlayTrack(previousTrack);
    }
  };

  const handleNext = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setQueue(prev => prev.slice(1));
      handlePlayTrack(nextTrack);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const handleAddToQueue = (track) => {
    setQueue(prev => [...prev, track]);
    toast.success(`Added "${track.title}" to queue`);
  };

  const handleRemoveFromQueue = (index) => {
    const track = queue[index];
    setQueue(prev => prev.filter((_, i) => i !== index));
    toast.success(`Removed "${track.title}" from queue`);
  };

  const handleClearQueue = () => {
    setQueue([]);
    toast.success('Queue cleared');
  };

  const handleRetry = () => {
    setError(null);
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleCanvas 
        isPlaying={isPlaying} 
        currentTrack={currentTrack} 
      />
      
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.header
          className="p-6 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text font-display">
              Resonance
            </h1>
            <p className="text-gray-400 mt-1">Immersive Music Experience</p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowQueue(!showQueue)}
            className="relative"
          >
            <ApperIcon name="ListMusic" size={20} />
            {queue.length > 0 && (
              <motion.span
                className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {queue.length}
              </motion.span>
            )}
          </Button>
        </motion.header>

        {/* Main Content */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Search and Results */}
            <div className="lg:col-span-2 space-y-8">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search for tracks, artists, or albums..."
              />
              
              <SearchResults
                tracks={searchResults}
                loading={loading}
                error={error}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                onAddToQueue={handleAddToQueue}
                onRetry={handleRetry}
              />
            </div>

            {/* Right Column - Player and Queue */}
            <div className="space-y-8">
              <PlayerCard
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                volume={volume}
                onPlayPause={handlePlayPause}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSeek={handleSeek}
                onVolumeChange={handleVolumeChange}
              />
              
              {showQueue && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <QueuePanel
                    queue={queue}
                    currentTrack={currentTrack}
                    isPlaying={isPlaying}
                    onPlayTrack={handlePlayTrack}
                    onRemoveFromQueue={handleRemoveFromQueue}
                    onClearQueue={handleClearQueue}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;