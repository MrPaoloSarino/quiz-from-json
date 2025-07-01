import React from 'react';
import { Cloud, HardDrive } from 'lucide-react';
import { Badge } from './badge';
import StorageManager from '@/utils/storageManager';

const StorageStatus: React.FC = () => {
  const storageInfo = StorageManager.getStorageInfo();
  const isOffline = storageInfo.mode === 'local_storage';

  return (
    <Badge 
      variant={isOffline ? "secondary" : "default"}
      className="flex items-center gap-1 text-xs"
    >
      {isOffline ? (
        <>
          <HardDrive className="w-3 h-3" />
          Offline Mode
        </>
      ) : (
        <>
          <Cloud className="w-3 h-3" />
          Cloud Mode
        </>
      )}
    </Badge>
  );
};

export default StorageStatus; 