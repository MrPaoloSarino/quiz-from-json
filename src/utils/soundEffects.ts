// Sound effect URLs - using more reliable sound effects
const SOUNDS = {
  correct: 'https://cdn.freesound.org/previews/131/131142_2337290-lq.mp3',
  incorrect: 'https://cdn.freesound.org/previews/131/131143_2337290-lq.mp3',
  start: 'https://cdn.freesound.org/previews/270/270402_5123851-lq.mp3',
  complete: 'https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3',
  next: 'https://cdn.freesound.org/previews/270/270403_5123851-lq.mp3',
  error: 'https://cdn.freesound.org/previews/270/270405_5123851-lq.mp3',
  success: 'https://cdn.freesound.org/previews/270/270406_5123851-lq.mp3',
  shuffle: 'https://cdn.freesound.org/previews/270/270407_5123851-lq.mp3',
  reset: 'https://cdn.freesound.org/previews/270/270408_5123851-lq.mp3'
};

// Cache for audio elements
const audioCache: { [key: string]: HTMLAudioElement } = {};

// Sound settings
let isMuted = false;
let volume = 0.5; // Default volume 50%

// Preload sounds
const preloadSounds = () => {
  Object.entries(SOUNDS).forEach(([key, url]) => {
    const audio = new Audio();
    audio.src = url;
    audio.preload = 'auto';
    audioCache[key] = audio;
  });
};

// Initialize sounds
preloadSounds();

export const setVolume = (newVolume: number) => {
  volume = Math.max(0, Math.min(1, newVolume)); // Clamp between 0 and 1
  // Update volume for all cached audio elements
  Object.values(audioCache).forEach(audio => {
    audio.volume = volume;
  });
};

export const toggleMute = () => {
  isMuted = !isMuted;
  // Update muted state for all cached audio elements
  Object.values(audioCache).forEach(audio => {
    audio.muted = isMuted;
  });
  return isMuted;
};

export const isSoundMuted = () => isMuted;

export const getVolume = () => volume;

export const playSound = (type: 'correct' | 'incorrect' | 'start' | 'complete' | 'next' | 'error' | 'success' | 'shuffle' | 'reset') => {
  if (isMuted) return;

  try {
    const audio = audioCache[type];
    if (!audio) {
      console.warn(`Sound ${type} not found in cache`);
      return;
    }

    // Reset the audio to start
    audio.currentTime = 0;
    
    // Play the sound
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Error playing sound:', error);
      });
    }
  } catch (error) {
    console.warn('Error with sound system:', error);
  }
}; 