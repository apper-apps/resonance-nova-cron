export const formatTime = (seconds) => {
  if (isNaN(seconds)) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const formatDuration = (seconds) => {
  return formatTime(seconds);
};

export const calculateProgress = (currentTime, duration) => {
  if (!duration || duration === 0) return 0;
  return (currentTime / duration) * 100;
};

export const parseTimeToSeconds = (timeString) => {
  if (!timeString) return 0;
  
  const parts = timeString.split(':');
  let seconds = 0;
  
  if (parts.length === 3) {
    // Hours:Minutes:Seconds
    seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  } else if (parts.length === 2) {
    // Minutes:Seconds
    seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
  } else {
    // Just seconds
    seconds = parseInt(parts[0]);
  }
  
  return isNaN(seconds) ? 0 : seconds;
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getVolumeIcon = (volume) => {
  if (volume === 0) return 'VolumeX';
  if (volume < 30) return 'Volume';
  if (volume < 70) return 'Volume1';
  return 'Volume2';
};

export const normalizeVolume = (volume) => {
  return Math.max(0, Math.min(100, volume));
};

export const createAudioContext = () => {
  if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
    return new (window.AudioContext || window.webkitAudioContext)();
  }
  return null;
};

export const analyzeAudioFrequency = (audioContext, audioElement) => {
  if (!audioContext || !audioElement) return null;
  
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaElementSource(audioElement);
  
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  return {
    analyser,
    dataArray,
    bufferLength,
    getFrequencyData: () => {
      analyser.getByteFrequencyData(dataArray);
      return dataArray;
    }
  };
};