import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS } from '../constants';

interface SceneTransitionProps {
  startFrame: number;
  durationFrames?: number;
  direction?: 'left' | 'right';
  color?: string;
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  startFrame,
  durationFrames = 15,
  direction = 'left',
  color = COLORS.CYAN,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const half = durationFrames / 2;

  // Phase 1 (in): slide from offscreen into view, covering screen
  // Phase 2 (out): slide from covering screen to offscreen other side
  // translateX ranges: direction='left' → enters from right (+100%) → 0% → exits to left (-100%)
  // direction='right' → enters from left (-100%) → 0% → exits to right (+100%)

  let translateX: number;

  if (direction === 'left') {
    // Phase 1: 100% → 0%  (enters from right, slides left)
    // Phase 2: 0% → -100% (continues sliding left off screen)
    if (localFrame <= half) {
      translateX = interpolate(localFrame, [0, half], [100, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    } else {
      translateX = interpolate(localFrame, [half, durationFrames], [0, -100], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }
  } else {
    // direction === 'right'
    // Phase 1: -100% → 0%  (enters from left, slides right)
    // Phase 2: 0% → 100%   (continues sliding right off screen)
    if (localFrame <= half) {
      translateX = interpolate(localFrame, [0, half], [-100, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    } else {
      translateX = interpolate(localFrame, [half, durationFrames], [0, 100], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }
  }

  // Hide completely when outside the active window
  const isActive = localFrame >= 0 && localFrame <= durationFrames;
  if (!isActive) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: color,
        transform: `translateX(${translateX}%)`,
        zIndex: 100,
        pointerEvents: 'none',
      }}
    />
  );
};
