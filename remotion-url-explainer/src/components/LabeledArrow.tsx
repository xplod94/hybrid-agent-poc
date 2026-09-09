import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONT_FAMILY } from '../constants';

interface LabeledArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  color?: string;
  drawStartFrame?: number;
  drawDurationFrames?: number;
  dashed?: boolean;
}

export const LabeledArrow: React.FC<LabeledArrowProps> = ({
  x1,
  y1,
  x2,
  y2,
  label,
  color = COLORS.CYAN,
  drawStartFrame,
  drawDurationFrames = 30,
  dashed = false,
}) => {
  const frame = useCurrentFrame();

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Determine dash styling. When drawing, the full length becomes a single dash
  // and the offset shrinks from length to 0 to reveal the line.
  let strokeDasharray = dashed ? '8 6' : '';
  let strokeDashoffset = 0;

  if (drawStartFrame !== undefined) {
    const localFrame = Math.max(0, frame - drawStartFrame);
    const progress = interpolate(localFrame, [0, drawDurationFrames], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    strokeDasharray = String(length);
    strokeDashoffset = length * (1 - progress);
  }

  // Fade the label in just after the line finishes drawing.
  let labelOpacity = 1;
  if (drawStartFrame !== undefined) {
    const labelStart = drawStartFrame + drawDurationFrames;
    labelOpacity = interpolate(frame, [labelStart, labelStart + 15], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  return (
    <g>
      <defs>
        <marker
          id="labeledArrowHead"
          markerWidth="12"
          markerHeight="12"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L9,3 L0,6 Z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        markerEnd="url(#labeledArrowHead)"
      />
      {label && (
        <text
          x={midX}
          y={midY - 12}
          fill={COLORS.WHITE}
          fontSize={14}
          fontFamily={FONT_FAMILY}
          textAnchor="middle"
          style={{ opacity: labelOpacity, pointerEvents: 'none' }}
        >
          {label}
        </text>
      )}
    </g>
  );
};
