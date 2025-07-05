import mockTracks from '@/services/mockData/tracks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const musicService = {
  async searchTracks(query) {
    await delay(800);
    
    if (!query || query.trim() === '') {
      throw new Error('Search query cannot be empty');
    }
    
    // Simulate API error occasionally
    if (Math.random() < 0.1) {
      throw new Error('Failed to connect to music service');
    }
    
    const searchTerm = query.toLowerCase();
    const results = mockTracks.filter(track => 
      track.title.toLowerCase().includes(searchTerm) ||
      track.artist.toLowerCase().includes(searchTerm) ||
      track.album.toLowerCase().includes(searchTerm)
    );
    
    return results.slice(0, 10); // Return max 10 results
  },

  async getPopularTracks() {
    await delay(500);
    return mockTracks.slice(0, 20);
  },

  async getTrackById(id) {
    await delay(200);
    const track = mockTracks.find(t => t.Id === parseInt(id));
    if (!track) {
      throw new Error('Track not found');
    }
    return track;
  },

  async getRecommendations(trackId) {
    await delay(600);
    // Simple recommendation logic based on same artist or genre
    const currentTrack = mockTracks.find(t => t.Id === parseInt(trackId));
    if (!currentTrack) return [];
    
    return mockTracks
      .filter(t => t.Id !== parseInt(trackId) && t.artist === currentTrack.artist)
      .slice(0, 5);
  }
};