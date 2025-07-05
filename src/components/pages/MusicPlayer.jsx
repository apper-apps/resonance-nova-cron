import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SearchResults from "@/components/organisms/SearchResults";
import ApperIcon from "@/components/ApperIcon";
import ParticleCanvas from "@/components/organisms/ParticleCanvas";
import QueuePanel from "@/components/organisms/QueuePanel";
import PlayerCard from "@/components/organisms/PlayerCard";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import TrackCard from "@/components/molecules/TrackCard";
import { musicService } from "@/services/api/musicService";

const MusicPlayer = () => {
  const navigate = useNavigate();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [queue, setQueue] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [playlistResults, setPlaylistResults] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQueue, setShowQueue] = useState(false);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
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

// Load user playlists on mount
  useEffect(() => {
    loadUserPlaylists();
  }, []);

  const loadUserPlaylists = async () => {
    setLoadingPlaylists(true);
    try {
      const userPlaylists = await musicService.getUserPlaylists();
      setPlaylists(userPlaylists);
    } catch (err) {
      console.error('Failed to load playlists:', err);
      // Don't show error toast for playlists as it's not critical
    } finally {
      setLoadingPlaylists(false);
    }
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const results = await musicService.searchAll(query);
      setSearchResults(results.tracks || []);
      setPlaylistResults(results.playlists || []);
      
      const totalResults = (results.tracks?.length || 0) + (results.playlists?.length || 0);
      toast.success(`Found ${totalResults} results`);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to search');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlaylist = async (playlist) => {
    setSelectedPlaylist(playlist);
    setLoading(true);
    setError(null);
    
    try {
      const tracks = await musicService.getPlaylistTracks(playlist.id);
      setPlaylistTracks(tracks);
      toast.success(`Loaded ${tracks.length} tracks from "${playlist.name}"`);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load playlist tracks');
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
    setPlaylistResults([]);
    setSelectedPlaylist(null);
    setPlaylistTracks([]);
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
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
              className="relative"
            >
              <ApperIcon name="Settings" size={20} />
            </Button>
            
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
          </div>
        </motion.header>

{/* Main Content */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Search and Results */}
            <div className="lg:col-span-2 space-y-8">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search for tracks, artists, albums, or playlists..."
              />
              
              {/* User Playlists */}
              {!selectedPlaylist && playlists.length > 0 && !searchResults.length && !playlistResults.length && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <ApperIcon name="ListMusic" size={24} />
                    Your Playlists
                  </h2>
                  <div className="grid gap-4">
                    {playlists.map((playlist, index) => (
                      <motion.div
                        key={playlist.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="glass rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                              <ApperIcon name="ListMusic" size={20} className="text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{playlist.name}</h4>
                              <p className="text-gray-400 text-sm">
                                {playlist.tracks?.total || 0} tracks
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSelectPlaylist(playlist)}
                          >
                            <ApperIcon name="Play" size={16} className="mr-2" />
                            Select
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Selected Playlist Tracks */}
              {selectedPlaylist && playlistTracks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <ApperIcon name="ListMusic" size={24} />
                      {selectedPlaylist.name}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedPlaylist(null);
                        setPlaylistTracks([]);
                      }}
                    >
                      <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                      Back to Playlists
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    {playlistTracks.map((track, index) => (
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <TrackCard
                          track={track}
                          isPlaying={isPlaying && currentTrack?.id === track.id}
                          onPlay={handlePlayTrack}
                          onAddToQueue={handleAddToQueue}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Search Results */}
              {(searchResults.length > 0 || playlistResults.length > 0) && (
                <SearchResults
                  tracks={searchResults}
                  playlists={playlistResults}
                  loading={loading}
                  error={error}
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                  onPlayTrack={handlePlayTrack}
                  onAddToQueue={handleAddToQueue}
                  onSelectPlaylist={handleSelectPlaylist}
                  onRetry={handleRetry}
                />
              )}
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