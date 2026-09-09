import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT_FAMILY } from '../constants';

interface DiagramNodeProps {
  x: number;
  y: number;
  label: string;
  sublabel?: string;
  color?: string;
  width?: number;
  height?: number;
  shape?: 'rect' | 'circle';
  appearFrame?: number;
  style?: React.CSSProperties;
}

export const DiagramNode: React.FC<DiagramNodeProps> = ({
  x,
  y,
  label,
  sublabel,
  color = COLORS.CYAN,
  width = 160,
  height = 70,
  shape = 'rect',
  appearFrame = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - appearFrame);

  // Scale up with a spring settle.
  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.6 },
  });

  // Fade in over 20 frames.
  const opacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cornerRadius = shape === 'circle' ? undefined : 12;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ opacity, ...style }}
    >
      <g style={{ transformOrigin: '0px 0px', transform: `scale(${scale})` }}>
        {shape === 'circle' ? (
          <circle
            cx={0}
            cy={0}
            r={width / 2}
            fill={color}
            stroke={COLORS.WHITE}
            strokeWidth={2}
          />
        ) : (
          <rect
            x={-width / 2}
            y={-height / 2}
            width={width}
            height={height}
            rx={cornerRadius}
            fill={color}
            stroke={COLORS.WHITE}
            strokeWidth={2}
          />
        )}
        <text
          x={0}
          y={sublabel ? -4 : 0}
          fill={COLORS.WHITE}
          fontSize={16}
          fontWeight={700}
          fontFamily={FONT_FAMILY}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
        {sublabel && (
          <text
            x={0}
            y={18}
            fill={COLORS.WHITE}
            fontSize={12}
            opacity={0.85}
            fontFamily={FONT_FAMILY}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {sublabel}
          </text>
        )}
      </g>
    </g>
  );
};
