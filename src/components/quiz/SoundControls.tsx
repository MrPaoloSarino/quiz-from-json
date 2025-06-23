import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { setVolume, toggleMute, getMuteState, preloadSounds } from '@/utils/soundEffects';

const SoundControls: React.FC = () => {
  const [muted, setMuted] = React.useState(getMuteState());
  const [volume, setVolumeState] = React.useState(0.5);

  React.useEffect(() => {
    // Preload sounds when component mounts
    preloadSounds();
  }, []);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolumeState(newVolume);
    setVolume(newVolume);
  };

  const handleMuteToggle = () => {
    const newMuted = toggleMute();
    setMuted(newMuted);
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg">
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
        max={1}
        step={0.1}
        className="w-24"
      />
    </div>
  );
};

export default SoundControls; 