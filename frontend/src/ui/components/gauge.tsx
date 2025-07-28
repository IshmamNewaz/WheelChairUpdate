import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
  gaugeClasses,
} from '@mui/x-charts/Gauge';

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) return null;

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path d={`M ${cx} ${cy} L ${target.x} ${target.y}`} stroke="red" strokeWidth={3} />
    </g>
  );
}

export default function CompositionExample({ value }: { value: number }) {
  return (
    <div style={{ position: 'relative', width: 200, height: 220,  }}>
      <GaugeContainer
        width={200}
        height={200}
        startAngle={-110}
        endAngle={110}
        value={value}
        sx={{
          [`& .${gaugeClasses.valueArc}`]: {
            fill: '#52b202', // ✅ Green
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: '#e0e0e0',
          },
          [`& .${gaugeClasses.valueText}`]: {
            display: 'none', // hide default value text
          },
        }}
      >
        
        <GaugeReferenceArc />
        <GaugeValueArc />
        <GaugePointer />
      </GaugeContainer>
      

      {/* Manually positioned text */}
      <div
        style={{
          position: 'absolute',
          top: 180,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 24,
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        {value}
      </div>
      
    </div>
  );
}
