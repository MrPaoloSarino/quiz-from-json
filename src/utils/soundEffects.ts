// Sound effect URLs - using more subtle sounds
const SOUNDS = {
  correct: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+fz',
  incorrect: 'data:audio/wav;base64,UklGRuQCAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQACAAD/////AQAAAP////8BAAAA/////wEAAAD/////AQAAAP////8BAAAA/////wEAAAD/////AQAAAP////8BAAAA/////wEAAAD/////AQAAAP////8BAAAA//'
};

// Cache for audio elements
const audioCache: { [key: string]: HTMLAudioElement } = {};

// Track active intervals for cleanup
const activeIntervals = new Set<NodeJS.Timeout>();

// Sound settings - starting with lower volume
let volume = 0.3; // Reduced from 0.5 to 0.3
let isMuted = false;

// Preload sounds
export const preloadSounds = () => {
  Object.entries(SOUNDS).forEach(([key, url]) => {
    const audio = new Audio(url);
    audio.volume = volume;
    audio.preload = 'auto';
    audioCache[key] = audio;
  });
};

// Set volume
export const setVolume = (newVolume: number) => {
  volume = Math.max(0, Math.min(1, newVolume));
  Object.values(audioCache).forEach(audio => {
    if (!audio.muted) {
      audio.volume = volume;
    }
  });
};

// Get mute state
export const getMuteState = () => isMuted;

// Toggle mute
export const toggleMute = () => {
  isMuted = !isMuted;
  Object.values(audioCache).forEach(audio => {
    audio.muted = isMuted;
  });
  return isMuted;
};

// Clean up all active intervals
export const cleanupAudio = () => {
  activeIntervals.forEach(interval => {
    clearInterval(interval);
  });
  activeIntervals.clear();
};

// Play sound - now with fade effect for less intrusive sound
export const playSound = (type: 'correct' | 'incorrect') => {
  if (isMuted) return;

  const audio = audioCache[type];
  if (audio) {
    audio.currentTime = 0;
    audio.volume = volume * 0.7; // Make it even quieter
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
    });
    
    // Fade out the sound quickly
    const fadeTimeout = setTimeout(() => {
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.01) {
          audio.volume -= 0.05;
        } else {
          clearInterval(fadeOut);
          activeIntervals.delete(fadeOut);
          audio.pause();
        }
      }, 50);
      activeIntervals.add(fadeOut);
    }, 200);
  }
}; 