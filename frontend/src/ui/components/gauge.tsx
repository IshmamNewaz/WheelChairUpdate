import {

  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    // No value to display
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  );
}



export default function CompositionExample({ value }: { value: number }) {
  return (
    <GaugeContainer
      width={200}
      height={200}
      startAngle={-110}
      endAngle={110}
      value={value}
      
    >
      <GaugeReferenceArc />
      <GaugeValueArc />
      <GaugePointer />
      <text
        x={100} // Center horizontally
        y={180} // Position below the gauge
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="24px"
        fill="white"
        className="gauge-speed-value"
        
      >
        {value}
      </text>
    </GaugeContainer>
  );
}