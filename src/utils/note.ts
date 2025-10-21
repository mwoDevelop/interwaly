export const midiToFrequency = (midi: number, tuning = 440) => tuning * Math.pow(2, (midi - 69) / 12);

export const frequencyToMidi = (frequency: number, tuning = 440) => 69 + 12 * Math.log2(frequency / tuning);

export const randomMidiInRange = (min = 36, max = 84) => Math.floor(Math.random() * (max - min + 1)) + min;
