interface StaffPreviewProps {
  tonicMidi: number | null;
  intervalMidi: number | null;
}

const staffHeight = 80;
const lineSpacing = 12;

const midiToY = (midi: number) => {
  const middleC = 60;
  const offset = (midi - middleC) * (lineSpacing / 2);
  return staffHeight / 2 - offset;
};

export const StaffPreview = ({ tonicMidi, intervalMidi }: StaffPreviewProps) => {
  const notes = [tonicMidi, intervalMidi].filter((n): n is number => typeof n === 'number');

  return (
    <svg
      role="img"
      aria-label="Podgląd pięciolinii"
      width="100%"
      height={staffHeight}
      viewBox={`0 0 400 ${staffHeight}`}
      className="mt-6 rounded-lg border border-slate-800 bg-slate-900"
    >
      {[0, 1, 2, 3, 4].map((line) => (
        <line
          key={line}
          x1={10}
          x2={390}
          y1={20 + line * lineSpacing}
          y2={20 + line * lineSpacing}
          stroke="#475569"
          strokeWidth={1}
        />
      ))}
      {notes.map((midi, index) => (
        <g key={index} transform={`translate(${150 + index * 60}, ${midiToY(midi)})`}>
          <ellipse cx={0} cy={0} rx={10} ry={7} fill="#f8fafc" />
          <rect x={8} y={-30} width={2} height={30} fill="#f8fafc" />
        </g>
      ))}
    </svg>
  );
};
