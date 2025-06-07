// Sound effect URLs
const SOUNDS = {
  correct: 'https://cdn.freesound.org/previews/131/131142_2337290-lq.mp3',
  incorrect: 'https://cdn.freesound.org/previews/131/131143_2337290-lq.mp3'
};

// Cache for audio elements
const audioCache: { [key: string]: HTMLAudioElement } = {};

// Sound settings
let volume = 0.5;
let isMuted = false;

// Preload sounds
export const preloadSounds = () => {
  Object.entries(SOUNDS).forEach(([key, url]) => {
    const audio = new Audio(url);
    audio.volume = volume;
    audioCache[key] = audio;
  });
};

// Set volume
export const setVolume = (newVolume: number) => {
  volume = Math.max(0, Math.min(1, newVolume));
  Object.values(audioCache).forEach(audio => {
    audio.volume = volume;
  });
};

// Toggle mute
export const toggleMute = () => {
  isMuted = !isMuted;
  Object.values(audioCache).forEach(audio => {
    audio.muted = isMuted;
  });
  return isMuted;
};

// Get mute state
export const getMuteState = () => isMuted;

// Play sound
export const playSound = (type: 'correct' | 'incorrect') => {
  if (isMuted) return;

  const audio = audioCache[type];
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  }
}; 