/* eslint-disable no-restricted-globals */
const yin = (buffer: Float32Array, sampleRate: number) => {
  const threshold = 0.1;
  const probability = 0;
  let tau;
  const yinBuffer = new Float32Array(buffer.length / 2);

  for (let t = 0; t < yinBuffer.length; t++) {
    yinBuffer[t] = 0;
  }

  for (let t = 1; t < yinBuffer.length; t++) {
    for (let i = 0; i < yinBuffer.length; i++) {
      const delta = buffer[i] - buffer[i + t];
      yinBuffer[t] += delta * delta;
    }
  }

  yinBuffer[0] = 1;
  let runningSum = 0;
  for (let t = 1; t < yinBuffer.length; t++) {
    runningSum += yinBuffer[t];
    yinBuffer[t] *= t / runningSum;
  }

  for (tau = 2; tau < yinBuffer.length; tau++) {
    if (yinBuffer[tau] < threshold) {
      while (tau + 1 < yinBuffer.length && yinBuffer[tau + 1] < yinBuffer[tau]) {
        tau++;
      }
      return sampleRate / tau;
    }
  }

  if (probability === 0) {
    return null;
  }
  return sampleRate / tau;
};


type WorkerMessage = { type: 'analyze'; payload: { buffer: Float32Array; sampleRate: number } };
type WorkerResponse = { type: 'result'; frequency: number | null };

self.onmessage = (event: MessageEvent) => {
  const data = event.data as WorkerMessage;
  if (data.type === 'analyze') {
    const { buffer, sampleRate } = data.payload;
    const frequency = yin(buffer, sampleRate);
    const response: WorkerResponse = { type: 'result', frequency };
  self.postMessage(response);
  }
};
