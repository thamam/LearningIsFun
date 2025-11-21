import { NumberLineVisualData } from '@/lib/math';

interface NumberLineRendererProps {
  data: NumberLineVisualData;
}

export default function NumberLineRenderer({ data }: NumberLineRendererProps) {
  const { min, max, interval, arrowPosition } = data;

  // SVG dimensions
  const width = 800;
  const height = 120;
  const padding = 60;
  const lineY = 50;
  const tickHeight = 20;
  const labelOffset = 35;

  // Calculate positions
  const lineLength = width - 2 * padding;
  const steps = (max - min) / interval;

  // Helper function to convert value to X position
  const valueToX = (value: number) => {
    const ratio = (value - min) / (max - min);
    return padding + ratio * lineLength;
  };

  // Generate tick marks and labels
  const ticks = [];
  for (let i = 0; i <= steps; i++) {
    const value = min + i * interval;
    const x = valueToX(value);

    ticks.push({
      value,
      x,
      isMajor: true, // All ticks are major for now
    });
  }

  return (
    <div className="w-full flex justify-center my-6">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="max-w-full h-auto"
        style={{ direction: 'ltr' }}
      >
        {/* Main horizontal line */}
        <line
          x1={padding}
          y1={lineY}
          x2={width - padding}
          y2={lineY}
          className="stroke-gray-800"
          strokeWidth="3"
        />

        {/* Left arrow end */}
        <polygon
          points={`${padding},${lineY} ${padding - 8},${lineY - 6} ${padding - 8},${lineY + 6}`}
          className="fill-gray-800"
        />

        {/* Right arrow end */}
        <polygon
          points={`${width - padding},${lineY} ${width - padding + 8},${lineY - 6} ${width - padding + 8},${lineY + 6}`}
          className="fill-gray-800"
        />

        {/* Tick marks and labels */}
        {ticks.map((tick, index) => (
          <g key={index}>
            {/* Tick mark */}
            <line
              x1={tick.x}
              y1={lineY - tickHeight / 2}
              x2={tick.x}
              y2={lineY + tickHeight / 2}
              className="stroke-gray-800"
              strokeWidth="2"
            />

            {/* Label */}
            <text
              x={tick.x}
              y={lineY + labelOffset}
              textAnchor="middle"
              className="fill-gray-800 text-sm font-semibold"
              style={{ fontFamily: 'sans-serif' }}
            >
              {tick.value}
            </text>
          </g>
        ))}

        {/* Arrow pointing to position (if specified) */}
        {arrowPosition !== undefined && (
          <g>
            {/* Arrow pointer */}
            <text
              x={valueToX(arrowPosition)}
              y={lineY - 25}
              textAnchor="middle"
              className="text-3xl"
              style={{ fontSize: '32px' }}
            >
              ⬇️
            </text>

            {/* Highlight circle at the position */}
            <circle
              cx={valueToX(arrowPosition)}
              cy={lineY}
              r="6"
              className="fill-red-500 stroke-red-700"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
