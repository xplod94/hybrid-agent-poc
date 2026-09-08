export const FPS = 30;
export const DURATION_IN_FRAMES = 1800; // 60 seconds
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene start frames (absolute)
export const SCENES = {
  TITLE:      { start: 0,    end: 120  },
  TYPING_URL: { start: 120,  end: 360  },
  DNS:        { start: 360,  end: 660  },
  TCP:        { start: 660,  end: 960  },
  HTTP:       { start: 960,  end: 1320 },
  RENDERING:  { start: 1320, end: 1620 },
  OUTRO:      { start: 1620, end: 1800 },
} as const;

// Design tokens
export const COLORS = {
  BG:       '#0A0E1A',
  CYAN:     '#00D4FF',
  PURPLE:   '#7C3AED',
  GREEN:    '#10B981',
  AMBER:    '#F59E0B',
  WHITE:    '#FFFFFF',
  GRAY:     '#64748B',
  GRAY_DIM: '#1E293B',
} as const;

export const FONT_FAMILY = "'Inter', sans-serif";

// Transition overlap in frames
export const TRANSITION_FRAMES = 15;
