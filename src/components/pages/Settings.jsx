import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import { spotifyService } from '@/services/api/musicService';

const Settings = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    clientId: '',
    clientSecret: ''
  });
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [errors, setErrors] = useState({});

  // Load saved credentials and check connection on mount
  useEffect(() => {
    const savedCredentials = spotifyService.getCredentials();
    if (savedCredentials.clientId && savedCredentials.clientSecret) {
      setCredentials(savedCredentials);
      checkConnection();
    }
  }, []);

  // Handle URL parameters for OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      toast.error(`Spotify authorization failed: ${error}`);
      return;
    }

    if (code && state) {
      handleOAuthCallback(code, state);
    }
  }, []);

  const handleOAuthCallback = async (code, state) => {
    setLoading(true);
    try {
      await spotifyService.exchangeCodeForToken(code, state);
      toast.success('Successfully connected to Spotify!');
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Check connection status
      await checkConnection();
    } catch (error) {
      toast.error(`Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkConnection = async () => {
    if (!spotifyService.isConnected()) {
      setConnectionStatus('disconnected');
      return;
    }

    setTestingConnection(true);
    try {
      const result = await spotifyService.testConnection();
      if (result.success) {
        setConnectionStatus('connected');
        setUserProfile(result.profile);
      } else {
        setConnectionStatus('error');
        toast.error('Connection test failed');
      }
    } catch (error) {
      setConnectionStatus('error');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.clientId.trim()) {
      newErrors.clientId = 'Client ID is required';
    }
    
    if (!credentials.clientSecret.trim()) {
      newErrors.clientSecret = 'Client Secret is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCredentials = () => {
    if (!validateForm()) return;

    try {
      spotifyService.setCredentials(credentials.clientId, credentials.clientSecret);
      toast.success('Credentials saved successfully!');
      setConnectionStatus('disconnected');
      setUserProfile(null);
    } catch (error) {
      toast.error('Failed to save credentials');
    }
  };

  const handleConnectToSpotify = () => {
    if (!validateForm()) return;

    // Save credentials first
    spotifyService.setCredentials(credentials.clientId, credentials.clientSecret);
    
    // Redirect to Spotify authorization
    const authUrl = spotifyService.getAuthorizationUrl(credentials.clientId);
    window.location.href = authUrl;
  };

  const handleDisconnect = () => {
    spotifyService.clearCredentials();
    setConnectionStatus('disconnected');
    setUserProfile(null);
    setCredentials({ clientId: '', clientSecret: '' });
    toast.info('Disconnected from Spotify');
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'error': return 'text-error';
      default: return 'text-gray-400';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'error': return 'Connection Error';
      default: return 'Not Connected';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="icon"
              onClick={() => navigate('/')}
              className="flex-shrink-0"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </Button>
            <h1 className="text-3xl font-bold gradient-text">Settings</h1>
          </div>
        </motion.div>

        {/* Spotify Connection Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <ApperIcon name="Music" size={24} className="text-accent" />
            <h2 className="text-xl font-semibold">Spotify Integration</h2>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-success' : 
              connectionStatus === 'error' ? 'bg-error' : 'bg-gray-500'
            }`} />
            <span className={`font-medium ${getConnectionStatusColor()}`}>
              {testingConnection ? 'Testing...' : getConnectionStatusText()}
            </span>
            {userProfile && (
              <span className="text-gray-400">
                ({userProfile.display_name})
              </span>
            )}
          </div>

          {/* Credentials Form */}
          <div className="space-y-4 mb-6">
            <Input
              label="Spotify Client ID"
              value={credentials.clientId}
              onChange={(e) => handleInputChange('clientId', e.target.value)}
              placeholder="Enter your Spotify Client ID"
              error={errors.clientId}
            />
            <Input
              label="Spotify Client Secret"
              type="password"
              value={credentials.clientSecret}
              onChange={(e) => handleInputChange('clientSecret', e.target.value)}
              placeholder="Enter your Spotify Client Secret"
              error={errors.clientSecret}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              onClick={handleSaveCredentials}
              disabled={!credentials.clientId || !credentials.clientSecret}
            >
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Credentials
            </Button>
            
            {connectionStatus !== 'connected' ? (
              <Button
                variant="primary"
                onClick={handleConnectToSpotify}
                disabled={!credentials.clientId || !credentials.clientSecret}
              >
                <ApperIcon name="Link" size={16} className="mr-2" />
                Connect to Spotify
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={handleDisconnect}
                className="text-error hover:bg-error/10"
              >
                <ApperIcon name="Unlink" size={16} className="mr-2" />
                Disconnect
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;