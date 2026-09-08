import { Composition } from 'remotion';
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from './constants';

const UrlExplainer = () => (
  <div style={{ background: '#0A0E1A', width: '100%', height: '100%' }} />
);

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="UrlExplainer"
      component={UrlExplainer}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{}}
    />
  );
};
