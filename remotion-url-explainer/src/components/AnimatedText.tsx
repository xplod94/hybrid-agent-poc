import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface AnimatedTextProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  delay = 0,
  direction = 'up',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - delay);

  const opacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateValue = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 15,
      stiffness: 100,
      mass: 0.5,
    },
  });

  // Map spring 0→1 to offset distance→0
  const OFFSET = 40;
  const progress = translateValue; // 0 at start, 1 when settled

  let translateX = 0;
  let translateY = 0;

  switch (direction) {
    case 'up':
      translateY = OFFSET * (1 - progress);
      break;
    case 'down':
      translateY = -OFFSET * (1 - progress);
      break;
    case 'left':
      translateX = OFFSET * (1 - progress);
      break;
    case 'right':
      translateX = -OFFSET * (1 - progress);
      break;
  }

  return (
    <div
      style={{
        opacity,
        transform: `translate(${translateX}px, ${translateY}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
