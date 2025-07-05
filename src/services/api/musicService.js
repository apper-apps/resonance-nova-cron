import mockTracks from '@/services/mockData/tracks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to check if Spotify is connected
const isSpotifyConnected = () => {
  return !!localStorage.getItem('spotify_access_token');
};

// Helper function to make authenticated Spotify API calls
const makeSpotifyRequest = async (endpoint) => {
  const accessToken = localStorage.getItem('spotify_access_token');
  if (!accessToken) {
    throw new Error('Spotify not connected');
  }

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Spotify authentication expired');
    }
    throw new Error(`Spotify API error: ${response.statusText}`);
  }

  return response.json();
};

// Helper function to convert Spotify track to internal format
const convertSpotifyTrack = (spotifyTrack) => {
  return {
    id: spotifyTrack.id,
    Id: spotifyTrack.id, // For compatibility
    title: spotifyTrack.name,
    artist: spotifyTrack.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
    album: spotifyTrack.album?.name || 'Unknown Album',
    duration: Math.floor(spotifyTrack.duration_ms / 1000),
    imageUrl: spotifyTrack.album?.images?.[0]?.url || null,
    previewUrl: spotifyTrack.preview_url
  };
};

// Helper function to convert Spotify playlist to internal format
const convertSpotifyPlaylist = (spotifyPlaylist) => {
  return {
    id: spotifyPlaylist.id,
    name: spotifyPlaylist.name,
    description: spotifyPlaylist.description,
    tracks: spotifyPlaylist.tracks,
    imageUrl: spotifyPlaylist.images?.[0]?.url || null,
    owner: spotifyPlaylist.owner?.display_name || 'Unknown'
  };
};

export const musicService = {
  async searchTracks(query) {
    await delay(800);
    
    if (!query || query.trim() === '') {
      throw new Error('Search query cannot be empty');
    }

    // Use Spotify API if connected
    if (isSpotifyConnected()) {
      try {
        const data = await makeSpotifyRequest(`/search?q=${encodeURIComponent(query)}&type=track&limit=20`);
        return data.tracks.items.map(convertSpotifyTrack);
      } catch (error) {
        console.error('Spotify search failed, falling back to mock data:', error);
        // Fall through to mock data
      }
    }

    // Fallback to mock data
    const searchTerm = query.toLowerCase();
    const results = mockTracks.filter(track => 
      track.title.toLowerCase().includes(searchTerm) ||
      track.artist.toLowerCase().includes(searchTerm) ||
      track.album.toLowerCase().includes(searchTerm)
    );
    
    return results.slice(0, 10);
  },

  async searchAll(query) {
    await delay(800);
    
    if (!query || query.trim() === '') {
      throw new Error('Search query cannot be empty');
    }

    // Use Spotify API if connected
    if (isSpotifyConnected()) {
      try {
        const data = await makeSpotifyRequest(`/search?q=${encodeURIComponent(query)}&type=track,playlist&limit=20`);
        return {
          tracks: data.tracks?.items?.map(convertSpotifyTrack) || [],
          playlists: data.playlists?.items?.map(convertSpotifyPlaylist) || []
        };
      } catch (error) {
        console.error('Spotify search failed, falling back to mock data:', error);
        // Fall through to mock data
      }
    }

    // Fallback to mock data (tracks only)
    const searchTerm = query.toLowerCase();
    const results = mockTracks.filter(track => 
      track.title.toLowerCase().includes(searchTerm) ||
      track.artist.toLowerCase().includes(searchTerm) ||
      track.album.toLowerCase().includes(searchTerm)
    );
    
    return {
      tracks: results.slice(0, 10),
      playlists: []
    };
  },

  async getUserPlaylists() {
    await delay(600);

    // Use Spotify API if connected
    if (isSpotifyConnected()) {
      try {
        const data = await makeSpotifyRequest('/me/playlists?limit=50');
        return data.items.map(convertSpotifyPlaylist);
      } catch (error) {
        console.error('Failed to fetch Spotify playlists:', error);
        return [];
      }
    }

    // Return empty array if not connected
    return [];
  },

  async getPlaylistTracks(playlistId) {
    await delay(800);

    // Use Spotify API if connected
    if (isSpotifyConnected()) {
      try {
        const data = await makeSpotifyRequest(`/playlists/${playlistId}/tracks?limit=50`);
        return data.items
          .filter(item => item.track && item.track.type === 'track')
          .map(item => convertSpotifyTrack(item.track));
      } catch (error) {
        console.error('Failed to fetch Spotify playlist tracks:', error);
        throw new Error('Failed to load playlist tracks');
      }
    }

    throw new Error('Spotify not connected');
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

// Spotify Web API integration
const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

export const spotifyService = {
  // Get stored credentials
  getCredentials() {
    const clientId = localStorage.getItem('spotify_client_id');
    const clientSecret = localStorage.getItem('spotify_client_secret');
    return { clientId, clientSecret };
  },

  // Store credentials
  setCredentials(clientId, clientSecret) {
    localStorage.setItem('spotify_client_id', clientId);
    localStorage.setItem('spotify_client_secret', clientSecret);
  },

  // Clear credentials
  clearCredentials() {
    localStorage.removeItem('spotify_client_id');
    localStorage.removeItem('spotify_client_secret');
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
  },

  // Generate authorization URL
  getAuthorizationUrl(clientId) {
    const redirectUri = encodeURIComponent(window.location.origin + '/settings');
    const scope = encodeURIComponent('user-read-private user-read-email user-library-read user-top-read');
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('spotify_auth_state', state);
    
    return `${SPOTIFY_AUTH_URL}?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scope}&` +
      `state=${state}`;
  },

  // Exchange authorization code for access token
  async exchangeCodeForToken(code, state) {
    const storedState = localStorage.getItem('spotify_auth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    const { clientId, clientSecret } = this.getCredentials();
    if (!clientId || !clientSecret) {
      throw new Error('Spotify credentials not found');
    }

    const redirectUri = window.location.origin + '/settings';
    const credentials = btoa(`${clientId}:${clientSecret}`);

    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange authorization code');
    }

    const data = await response.json();
    localStorage.setItem('spotify_access_token', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('spotify_refresh_token', data.refresh_token);
    }
    
    return data;
  },

  // Get user profile
  async getUserProfile() {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${SPOTIFY_BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  },

  // Check if user is connected
  isConnected() {
return !!localStorage.getItem('spotify_access_token');
  },

  // Test connection
  async testConnection() {
    try {
      const profile = await this.getUserProfile();
      return { success: true, profile };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user playlists
  async getUserPlaylists() {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${SPOTIFY_BASE_URL}/me/playlists?limit=50`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }

    return response.json();
  },

  // Get playlist tracks
  async getPlaylistTracks(playlistId) {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${SPOTIFY_BASE_URL}/playlists/${playlistId}/tracks?limit=50`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playlist tracks');
    }

    return response.json();
  },

  // Search for tracks and playlists
  async search(query, types = 'track,playlist') {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${SPOTIFY_BASE_URL}/search?q=${encodeURIComponent(query)}&type=${types}&limit=20`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to search');
    }

    return response.json();
  }
};