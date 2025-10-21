import { useEffect, useState } from 'react';
import { resumeAudioContext } from '../lib/audio/context';

let unlocked = false;

const tryUnlock = async () => {
  try {
    await resumeAudioContext();
    unlocked = true;
    return true;
  } catch (error) {
    console.warn('Nie udało się odblokować audio', error);
    return false;
  }
};

export const useAudioUnlock = () => {
  const [ready, setReady] = useState(unlocked);

  useEffect(() => {
    if (ready) {
      return;
    }

    const handleInteraction = async () => {
      const success = await tryUnlock();
      if (success) {
        setReady(true);
        document.removeEventListener('pointerdown', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
      }
    };

    const attemptImmediate = async () => {
      const success = await tryUnlock();
      if (success) {
        setReady(true);
        document.removeEventListener('pointerdown', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
      }
    };

    void attemptImmediate();

    document.addEventListener('pointerdown', handleInteraction, { passive: true });
    document.addEventListener('keydown', handleInteraction, { passive: true });
    document.addEventListener('touchstart', handleInteraction, { passive: true });

    return () => {
      document.removeEventListener('pointerdown', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [ready]);

  return ready;
};
