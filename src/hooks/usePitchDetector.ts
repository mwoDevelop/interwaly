import { useEffect, useRef, useState } from 'react';

interface PitchResult {
  frequency: number | null;
  centsDiff: number | null;
}

export const usePitchDetector = (targetFrequency: number | null) => {
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState<PitchResult>({ frequency: null, centsDiff: null });
  const workerRef = useRef<Worker>();
  const mediaRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/pitchWorker.ts', import.meta.url), {
      type: 'module'
    });
    const worker = workerRef.current;
    worker.onmessage = (event) => {
      if (event.data.type === 'result') {
        const frequency = event.data.frequency;
        const centsDiff =
          targetFrequency && frequency
            ? 1200 * Math.log2(frequency / targetFrequency)
            : null;
        setResult({ frequency, centsDiff });
      }
    };
    return () => {
      worker.terminate();
    };
  }, [targetFrequency]);

  useEffect(() => {
    return () => {
      processorRef.current?.disconnect();
      mediaRef.current?.getTracks().forEach((track) => track.stop());
      contextRef.current?.close().catch(() => undefined);
    };
  }, []);

  const stop = async () => {
    processorRef.current?.disconnect();
    mediaRef.current?.getTracks().forEach((track) => track.stop());
    await contextRef.current?.close().catch(() => undefined);
    processorRef.current = null;
    mediaRef.current = null;
    contextRef.current = null;
    setRecording(false);
  };

  const start = async () => {
    if (recording) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRef.current = stream;
    const ctx = new AudioContext();
    contextRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(2048, 1, 1);
    processorRef.current = processor;
    processor.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);
      const copy = new Float32Array(input.length);
      copy.set(input);
      workerRef.current?.postMessage({ type: 'analyze', payload: { buffer: copy, sampleRate: ctx.sampleRate } }, [copy.buffer]);
    };
    source.connect(processor);
    processor.connect(ctx.destination);
    setRecording(true);
  };

  return { recording, start, stop, result };
};
