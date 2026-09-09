import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONT_FAMILY } from '../constants';

interface NetworkPacketProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startFrame: number;
  durationFrames: number;
  color?: string;
  size?: number;
  label?: string;
}

export const NetworkPacket: React.FC<NetworkPacketProps> = ({
  startX,
  startY,
  endX,
  endY,
  startFrame,
  durationFrames,
  color = COLORS.CYAN,
  size = 16,
  label,
}) => {
  const frame = useCurrentFrame();

  // Only render while the packet is within its travel window.
  const isWithinWindow =
    frame >= startFrame && frame <= startFrame + durationFrames;
  if (!isWithinWindow) return null;

  const localFrame = frame - startFrame;

  const progress = interpolate(localFrame, [0, durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const x = interpolate(localFrame, [0, durationFrames], [startX, endX], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(localFrame, [0, durationFrames], [startY, endY], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const labelOpacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={size / 2}
        fill={color}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      {label && (
        <text
          x={x + size / 2 + 8}
          y={y - size / 2 - 6}
          fill={COLORS.WHITE}
          fontSize={14}
          fontFamily={FONT_FAMILY}
          style={{ opacity: labelOpacity, pointerEvents: 'none' }}
        >
          {label}
        </text>
      )}
    </g>
  );
};
