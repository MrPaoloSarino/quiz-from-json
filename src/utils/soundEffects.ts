// Sound effect URLs - using free sound effects from a CDN
const SOUNDS = {
  correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  incorrect: 'https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3',
  start: 'https://assets.mixkit.co/active_storage/sfx/2002/2002-preview.mp3',
  complete: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
  next: 'https://assets.mixkit.co/active_storage/sfx/2004/2004-preview.mp3',
  button: 'https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2006/2006-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/2007/2007-preview.mp3',
  shuffle: 'https://assets.mixkit.co/active_storage/sfx/2008/2008-preview.mp3',
  reset: 'https://assets.mixkit.co/active_storage/sfx/2009/2009-preview.mp3'
};

// Cache for audio elements
const audioCache: { [key: string]: HTMLAudioElement } = {};

// Sound settings
let isMuted = false;
let volume = 0.5; // Default volume 50%

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

export const playSound = (type: 'correct' | 'incorrect' | 'start' | 'complete' | 'next' | 'button' | 'error' | 'success' | 'shuffle' | 'reset') => {
  if (isMuted) return;

  // Create audio element if not cached
  if (!audioCache[type]) {
    audioCache[type] = new Audio(SOUNDS[type]);
    audioCache[type].volume = volume;
  }

  // Reset the audio to start
  audioCache[type].currentTime = 0;
  
  // Play the sound
  audioCache[type].play().catch(error => {
    console.warn('Error playing sound:', error);
  });
}; 