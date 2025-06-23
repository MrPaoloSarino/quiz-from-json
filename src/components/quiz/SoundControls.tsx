import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { setVolume, toggleMute, getMuteState } from '@/utils/soundEffects';

const SoundControls: React.FC = () => {
  const [muted, setMuted] = useState(false);
  const [volume, setVolumeState] = useState(30); // Start with 30% volume (matches soundEffects.ts default)

  useEffect(() => {
    // Initialize mute state
    setMuted(getMuteState());
  }, []);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolumeState(newVolume);
    setVolume(newVolume / 100); // Convert percentage to decimal for the sound system
  };

  const handleMuteToggle = () => {
    const newMuted = toggleMute();
    setMuted(newMuted);
  };

  return (
    <div className="flex items-center gap-3 p-2 bg-white/70 backdrop-blur-md rounded-full shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleMuteToggle}
        className="h-8 w-8"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      <Slider
        value={[volume]}
        onValueChange={handleVolumeChange}
        max={100}
        step={5}
        className="w-28"
        disabled={muted}
      />
      <span className="text-xs text-gray-600 font-medium w-8 text-right">
        {muted ? '0%' : `${volume}%`}
      </span>
    </div>
  );
};

export default SoundControls; 