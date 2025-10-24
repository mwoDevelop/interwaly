let audioContext: AudioContext | null = null;

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const createAudioContext = () => {
  if (typeof window === 'undefined') {
    throw new Error('AudioContext jest dostępny tylko w przeglądarce.');
  }

  const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContextConstructor) {
    throw new Error('Web Audio API nie jest obsługiwane w tej przeglądarce.');
  }

  return new AudioContextConstructor();
};

export const getAudioContext = () => {
  if (!audioContext) {
    audioContext = createAudioContext();
  }
  return audioContext;
};

export const resumeAudioContext = async () => {
  const ctx = getAudioContext();
  const state = ctx.state as AudioContextState | 'interrupted';
  if (state === 'suspended' || state === 'interrupted') {
    try {
      await ctx.resume();
    } catch (error) {
      console.warn('Nie udało się wznowić kontekstu audio.', error);
    }
  }
  return ctx;
};
