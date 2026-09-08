# Project Implementation Plan

## Project
**"How a URL Loads a Webpage"** — 60-second faceless explainer video built with Remotion + TypeScript, output at 1920×1080 @ 30fps.

---

## Architecture Overview

### Scene Map (30 fps, 1800 total frames)

| Scene | Title                    | Start Frame | End Frame | Duration |
|-------|--------------------------|-------------|-----------|----------|
| 01    | Title Card               | 0           | 120       | 4 s      |
| 02    | Typing the URL           | 120         | 360       | 8 s      |
| 03    | DNS Lookup               | 360         | 660       | 10 s     |
| 04    | TCP Handshake + TLS      | 660         | 960       | 10 s     |
| 05    | HTTP Request & Response  | 960         | 1320      | 12 s     |
| 06    | Browser Rendering        | 1320        | 1620      | 10 s     |
| 07    | Outro / Summary          | 1620        | 1800      | 6 s      |

### Design System
- **Background**: `#0A0E1A` (deep navy)
- **Accent 1**: `#00D4FF` (electric cyan — network data)
- **Accent 2**: `#7C3AED` (purple — browser UI chrome)
- **Accent 3**: `#10B981` (green — success/response)
- **Warning**: `#F59E0B` (amber — in-transit)
- **Font**: Inter (via Google Fonts CDN or bundled)
- **Easing**: `spring({ fps, frame, config: { damping: 12, stiffness: 100 } })`

### Reusable Components
- `AnimatedText` — text fade-in/slide with configurable direction and delay
- `SceneTransition` — slide-wipe left-to-right transition between scenes
- `NetworkPacket` — animated dot/packet travelling along an SVG path
- `DiagramNode` — rectangular or circular labeled box for network diagrams
- `LabeledArrow` — SVG arrow with a text label for diagram connections
- `CodeLine` — text that types itself character-by-character
- `BrowserWindow` — mock browser chrome frame with address bar
- `ProgressBar` — horizontal fill bar for loading/progress animations

### File Structure
```
remotion-url-explainer/
├── package.json
├── tsconfig.json
├── remotion.config.ts
├── src/
│   ├── Root.tsx
│   ├── constants.ts
│   ├── types.ts
│   ├── components/
│   │   ├── AnimatedText.tsx
│   │   ├── SceneTransition.tsx
│   │   ├── NetworkPacket.tsx
│   │   ├── DiagramNode.tsx
│   │   ├── LabeledArrow.tsx
│   │   ├── CodeLine.tsx
│   │   ├── BrowserWindow.tsx
│   │   └── ProgressBar.tsx
│   └── scenes/
│       ├── Scene01Title.tsx
│       ├── Scene02TypingURL.tsx
│       ├── Scene03DNS.tsx
│       ├── Scene04TCPHandshake.tsx
│       ├── Scene05HTTPRequest.tsx
│       ├── Scene06Rendering.tsx
│       └── Scene07Outro.tsx
```

---

## Architecture Decisions

1. **Remotion 4.x** — use `@remotion/cli` and `remotion` packages (latest stable).
2. **TypeScript strict mode** — all files use `.tsx`, `strict: true` in tsconfig.
3. **No external animation libraries** — use only Remotion's built-in `interpolate`, `spring`, `useCurrentFrame`, `useVideoConfig` hooks to keep the bundle minimal.
4. **SVG for diagrams** — all network diagrams are rendered as inline SVG inside React components, no images needed.
5. **Google Fonts via `@remotion/google-fonts`** — ensures font is bundled into the render output.
6. **Single composition** — one `UrlExplainer` composition of 1800 frames; scenes are React components rendered sequentially using frame offsets.
7. **Scene isolation** — each scene component receives `startFrom` frame offset from `constants.ts`; it internally uses `useCurrentFrame()` minus the offset.
8. **Transitions** — `SceneTransition` component wraps scene boundaries, animating 15-frame overlap wipes.

---

## Tasks

---

## TASK-001 — Initialize Remotion TypeScript project

### Objective
Scaffold a new Remotion project inside `remotion-url-explainer/` subdirectory within the workspace, configured for TypeScript with all required dependencies installed.

### Files
- `remotion-url-explainer/package.json` (create)
- `remotion-url-explainer/tsconfig.json` (create)
- `remotion-url-explainer/remotion.config.ts` (create)
- `remotion-url-explainer/.gitignore` (create)

### Requirements
- Run inside workspace root: `C:\Users\Pranav\ai-projects\opencode-hybrid-poc`
- Create directory `remotion-url-explainer`
- `package.json` must include:
  - `"name": "remotion-url-explainer"`
  - `"version": "1.0.0"`
  - dependencies: `"remotion": "^4.0.0"`, `"react": "^18.0.0"`, `"react-dom": "^18.0.0"`, `"@remotion/cli": "^4.0.0"`, `"@remotion/google-fonts": "^4.0.0"`
  - devDependencies: `"typescript": "^5.0.0"`, `"@types/react": "^18.0.0"`, `"@types/react-dom": "^18.0.0"`
  - scripts: `"start": "remotion studio"`, `"build": "remotion bundle"`, `"render": "remotion render UrlExplainer out/explainer.mp4"`
- `tsconfig.json` must set:
  - `"strict": true`
  - `"jsx": "react-jsx"`
  - `"module": "ESNext"`
  - `"target": "ES2020"`
  - `"moduleResolution": "bundler"`
  - `"include": ["src"]`
- `remotion.config.ts` must call `Config.setVideoImageFormat("png")` and `Config.setCodec("h264")`
- `.gitignore` must exclude `node_modules/`, `out/`, `.remotion/`
- Run `npm install` inside `remotion-url-explainer/` to install dependencies

### Dependencies
None.

### Validation
```powershell
# Check directory exists
Test-Path "remotion-url-explainer\package.json"  # must return True
Test-Path "remotion-url-explainer\tsconfig.json" # must return True
Test-Path "remotion-url-explainer\remotion.config.ts" # must return True

# Check node_modules installed
Test-Path "remotion-url-explainer\node_modules\remotion" # must return True
```

### Definition of Done
- All four files exist with correct content
- `npm install` exits with code 0
- `node_modules/remotion` directory exists

### Status
COMPLETED (TASK-001)

---

## TASK-002 — Create constants, types, and Root composition

### Objective
Create the foundational shared files: `constants.ts` with all timing/color/design tokens, `types.ts` with shared TypeScript interfaces, and `Root.tsx` registering the single Remotion composition.

### Files
- `remotion-url-explainer/src/constants.ts` (create)
- `remotion-url-explainer/src/types.ts` (create)
- `remotion-url-explainer/src/Root.tsx` (create)

### Requirements

**`constants.ts`** must export:
```typescript
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
```

**`types.ts`** must export these interfaces:
```typescript
export interface SceneProps {
  startFrom: number; // absolute frame when this scene begins
}

export interface DiagramNodeData {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  color: string;
}

export interface ArrowData {
  fromId: string;
  toId: string;
  label?: string;
}
```

**`Root.tsx`** must:
- Import `Composition` from `remotion`
- Import a placeholder `UrlExplainer` component (to be replaced later) — for now export an inline placeholder `() => <div style={{ background: '#0A0E1A', width: '100%', height: '100%' }} />`
- Register one composition:
  ```tsx
  <Composition
    id="UrlExplainer"
    component={UrlExplainer}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{}}
  />
  ```

### Dependencies
TASK-001

### Validation
```powershell
Test-Path "remotion-url-explainer\src\constants.ts"  # True
Test-Path "remotion-url-explainer\src\types.ts"       # True
Test-Path "remotion-url-explainer\src\Root.tsx"       # True
```
Run TypeScript compile check:
```powershell
npx tsc --noEmit
```
Must produce zero errors.

### Definition of Done
- All three files exist with correct content matching the specifications above
- `npx tsc --noEmit` exits with code 0

### Status
COMPLETED (TASK-002)

---

## TASK-003 — Build AnimatedText and SceneTransition components

### Objective
Create the two most-used utility components: `AnimatedText` (animated text reveal) and `SceneTransition` (scene-boundary wipe).

### Files
- `remotion-url-explainer/src/components/AnimatedText.tsx` (create)
- `remotion-url-explainer/src/components/SceneTransition.tsx` (create)

### Requirements

**`AnimatedText.tsx`**:
- Props interface:
  ```typescript
  interface AnimatedTextProps {
    children: React.ReactNode;
    delay?: number;          // frames to wait before starting (default 0)
    direction?: 'up' | 'down' | 'left' | 'right'; // slide direction (default 'up')
    style?: React.CSSProperties;
  }
  ```
- Uses `useCurrentFrame()` and `interpolate()` from `remotion`
- Animation: from opacity 0 + translateY(30px) to opacity 1 + translateY(0) over 20 frames after delay
- Use `spring()` from `remotion` for the translate value
- `extrapolateLeft: 'clamp'`, `extrapolateRight: 'clamp'` on all `interpolate()` calls
- `direction` maps to appropriate CSS translate axis and direction

**`SceneTransition.tsx`**:
- Props interface:
  ```typescript
  interface SceneTransitionProps {
    startFrame: number;       // absolute frame when transition starts
    durationFrames?: number;  // default 15
    direction?: 'left' | 'right'; // wipe direction (default 'left')
    color?: string;           // overlay color, default COLORS.CYAN
  }
  ```
- Uses `useCurrentFrame()` from `remotion`
- Renders a full-screen `position: absolute` div that slides across from one edge, covers the screen at midpoint, then slides off the other edge
- Transition is a two-phase wipe (in: 0→durationFrames/2, out: durationFrames/2→durationFrames)
- Uses `interpolate()` with `extrapolateLeft: 'clamp'`, `extrapolateRight: 'clamp'`

### Dependencies
TASK-002

### Validation
```powershell
Test-Path "remotion-url-explainer\src\components\AnimatedText.tsx"    # True
Test-Path "remotion-url-explainer\src\components\SceneTransition.tsx" # True
npx tsc --noEmit  # 0 errors
```

### Definition of Done
- Both files exist with no TypeScript errors
- `AnimatedText` renders children with slide+fade animation
- `SceneTransition` renders a full-width colored wipe overlay

### Status
PENDING

---

## TASK-004 — Build NetworkPacket, DiagramNode, and LabeledArrow components

### Objective
Create the three SVG-based diagram components used across the DNS and TCP scenes.

### Files
- `remotion-url-explainer/src/components/NetworkPacket.tsx` (create)
- `remotion-url-explainer/src/components/DiagramNode.tsx` (create)
- `remotion-url-explainer/src/components/LabeledArrow.tsx` (create)

### Requirements

**`NetworkPacket.tsx`**:
- Props:
  ```typescript
  interface NetworkPacketProps {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    startFrame: number;    // absolute frame to begin travel
    durationFrames: number; // frames to reach destination
    color?: string;        // default COLORS.CYAN
    size?: number;         // circle radius, default 8
    label?: string;        // optional text label on packet
  }
  ```
- Uses `useCurrentFrame()` + `interpolate()` to lerp position from start to end
- Renders as an SVG `<circle>` with optional `<text>` label
- When before `startFrame` or after `startFrame + durationFrames`, opacity is 0
- Use `extrapolateLeft: 'clamp'`, `extrapolateRight: 'clamp'`

**`DiagramNode.tsx`**:
- Props:
  ```typescript
  interface DiagramNodeProps {
    x: number;
    y: number;
    label: string;
    sublabel?: string;
    color: string;
    width?: number;   // default 160
    height?: number;  // default 70
    appearFrame?: number; // absolute frame to fade in (default 0)
  }
  ```
- Renders an SVG `<rect>` with rounded corners (`rx="10"`) and centered `<text>` label
- `sublabel` renders below main label in smaller font
- If `appearFrame` is set, fades in with `interpolate()` over 20 frames

**`LabeledArrow.tsx`**:
- Props:
  ```typescript
  interface LabeledArrowProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    label?: string;
    color?: string;     // default COLORS.GRAY
    appearFrame?: number; // absolute frame to fade in
    animated?: boolean; // if true, stroke-dashoffset animates (draw-on effect)
    durationFrames?: number; // how long to draw (default 30)
  }
  ```
- Renders SVG `<line>` with an arrowhead marker (`<defs><marker>`)
- When `animated: true`, uses `stroke-dasharray` + `stroke-dashoffset` + `interpolate()` to draw the line on
- Label renders at midpoint of the line

### Dependencies
TASK-002

### Validation
```powershell
Test-Path "remotion-url-explainer\src\components\NetworkPacket.tsx"  # True
Test-Path "remotion-url-explainer\src\components\DiagramNode.tsx"    # True
Test-Path "remotion-url-explainer\src\components\LabeledArrow.tsx"   # True
npx tsc --noEmit  # 0 errors
```

### Definition of Done
- All three files exist with no TypeScript errors
- Each component correctly uses Remotion hooks

### Status
PENDING

---

## TASK-005 — Build CodeLine, BrowserWindow, and ProgressBar components

### Objective
Create the three remaining reusable components: a typewriter-effect code line, a mock browser chrome frame, and a fill progress bar.

### Files
- `remotion-url-explainer/src/components/CodeLine.tsx` (create)
- `remotion-url-explainer/src/components/BrowserWindow.tsx` (create)
- `remotion-url-explainer/src/components/ProgressBar.tsx` (create)

### Requirements

**`CodeLine.tsx`**:
- Props:
  ```typescript
  interface CodeLineProps {
    text: string;
    startFrame: number;     // absolute frame to begin typing
    charsPerFrame?: number; // default 2
    color?: string;         // default COLORS.CYAN
    style?: React.CSSProperties;
  }
  ```
- Uses `useCurrentFrame()` to calculate how many characters to show: `Math.floor((frame - startFrame) * charsPerFrame)`
- Renders `text.slice(0, visibleChars)` in a monospace font
- Appends a blinking `|` cursor using CSS animation (use `<style>` tag inline or a keyframe string in JS — do NOT require an external CSS file)

**`BrowserWindow.tsx`**:
- Props:
  ```typescript
  interface BrowserWindowProps {
    url?: string;
    children?: React.ReactNode;
    width?: number;       // default 1400
    height?: number;      // default 800
    showCursor?: boolean; // show a typed cursor in address bar (default false)
    urlRevealFrame?: number; // if set, URL text types in using CodeLine logic
  }
  ```
- Renders a mock browser window with:
  - Dark chrome header bar (`#1E293B`) with 3 colored circles (red/yellow/green, 12px radius each)
  - Address bar (`#0F172A` background, rounded) centered in header
  - Content area (`#0A0E1A` background) below
  - Children rendered inside content area
- If `urlRevealFrame` is set, URL types in via `CodeLine`-style character reveal; otherwise displays static URL text

**`ProgressBar.tsx`**:
- Props:
  ```typescript
  interface ProgressBarProps {
    startFrame: number;
    durationFrames: number;
    color?: string;         // default COLORS.CYAN
    backgroundColor?: string; // default COLORS.GRAY_DIM
    height?: number;        // bar height in px, default 8
    width?: number;         // bar width in px, default 400
    label?: string;         // text above bar
    style?: React.CSSProperties;
  }
  ```
- Uses `interpolate()` to animate width from 0% to 100% between `startFrame` and `startFrame + durationFrames`
- Renders outer container + inner fill div with CSS `borderRadius: 4`

### Dependencies
TASK-002

### Validation
```powershell
Test-Path "remotion-url-explainer\src\components\CodeLine.tsx"     # True
Test-Path "remotion-url-explainer\src\components\BrowserWindow.tsx" # True
Test-Path "remotion-url-explainer\src\components\ProgressBar.tsx"   # True
npx tsc --noEmit  # 0 errors
```

### Definition of Done
- All three files exist with no TypeScript errors
- Each component uses `useCurrentFrame()` and Remotion interpolation

### Status
PENDING

---

## TASK-006 — Implement Scene 01: Title Card

### Objective
Build the opening scene that introduces the video title with animated text and a glowing background.

### Files
- `remotion-url-explainer/src/scenes/Scene01Title.tsx` (create)

### Requirements
- Receives `SceneProps` (`startFrom: number`) from `types.ts`
- Local frame: `const frame = useCurrentFrame() - startFrom`
- Background: solid `COLORS.BG` with a subtle radial gradient glow at center (use inline `background: radial-gradient(...)`)
- Elements to animate (all using `AnimatedText` or manual `interpolate()`):
  1. Small subtitle line "Explainer Series" fades in at frame 0 (local), small caps, `COLORS.GRAY`
  2. Main title "How a URL Loads a Webpage" slides up from below at local frame 10, large font (96px), bold, white
  3. Accent line (a horizontal `COLORS.CYAN` bar, 4px tall, 120px wide) animates width from 0 to 120px at local frame 25
  4. URL text `https://example.com` types in below at local frame 40, using `CodeLine` or manual slicing, `COLORS.CYAN`
- All elements must use `extrapolateLeft: 'clamp'`, `extrapolateRight: 'clamp'`
- At scene end (local frame 90–120), elements fade out using `interpolate()`

### Dependencies
TASK-003, TASK-005

### Validation
```powershell
Test-Path "remotion-url-explainer\src\scenes\Scene01Title.tsx" # True
npx tsc --noEmit  # 0 errors
```

### Definition of Done
- File exists, compiles with no TS errors
- Scene renders title card with animated text elements

### Status
PENDING

---

## TASK-007 — Implement Scene 02: Typing the URL

### Objective
Animate a browser window where the user types `https://example.com`, then highlights and labels each URL part (scheme, domain, path).

### Files
- `remotion-url-explainer/src/scenes/Scene02TypingURL.tsx` (create)

### Requirements
- Local frame offset: `useCurrentFrame() - startFrom` (startFrom = 120)
- Duration: 240 local frames (8 seconds)
- Layout: center a `BrowserWindow` component (width=1400, height=750) on screen
- Animation sequence (all local frame times):
  - Frame 0–60: Use `BrowserWindow` with `urlRevealFrame={0}` to type `https://example.com` into address bar
  - Frame 61–90: Highlight `https://` in cyan by overlaying a colored underline bar + label "Protocol" (`AnimatedText`)
  - Frame 91–140: Highlight `example` in purple with label "Domain Name" (`AnimatedText`)
  - Frame 141–190: Highlight `.com` in green with label "TLD" (`AnimatedText`)
  - Frame 191–240: All labels visible simultaneously; add a caption text "Let's see what happens next..." fading in
- Highlights are absolutely positioned `<div>` underline bars (height 4px, colored) overlaid on the address bar using known character positions
- Text labels appear above/below highlights with `AnimatedText`

### Dependencies
TASK-003, TASK-005, TASK-006

### Validation
```powershell
Test-Path "remotion-url-explainer\src\scenes\Scene02TypingURL.tsx" # True
npx tsc --noEmit  # 0 errors
```

### Definition of Done
- File compiles; scene sequence is correctly timed using local frame logic

### Status
PENDING

---

## TASK-008 — Implement Scene 03: DNS Lookup

### Objective
Build an animated network diagram showing the DNS resolution chain: Browser → DNS Resolver → Root Nameserver → TLD Nameserver → Authoritative Nameserver → IP Address returned.

### Files
- `remotion-url-explainer/src/scenes/Scene03DNS.tsx` (create)

### Requirements
- Local frame offset: `useCurrentFrame() - startFrom` (startFrom = 360)
- Duration: 300 local frames (10 seconds)
- The scene is full-screen dark background with an SVG overlay for the diagram
- Diagram nodes (use `DiagramNode` component, all positioned in SVG coordinate space):
  - "Browser" at (200, 400), color PURPLE
  - "DNS Resolver" at (500, 200), color CYAN
  - "Root NS" at (800, 400), color AMBER
  - "TLD NS (.com)" at (1100, 200), color AMBER
  - "Auth NS (example.com)" at (1400, 400), color GREEN
  - "IP: 93.184.216.34" at (960, 700), color GREEN (result node, larger)
- Animation sequence (local frames):
  - Frame 0–20: "Browser" node appears
  - Frame 20–40: "DNS Resolver" appears + `LabeledArrow` from Browser→Resolver draws on (animated=true)
  - Frame 40–60: `NetworkPacket` travels Browser→Resolver with label "Query: example.com"
  - Frame 60–80: "Root NS" appears + arrow Resolver→RootNS
  - Frame 80–100: Packet travels Resolver→RootNS
  - Frame 100–120: "TLD NS" appears + arrow RootNS→TLD
  - Frame 120–140: Packet travels RootNS→TLD
  - Frame 140–160: "Auth NS" appears + arrow TLD→AuthNS
  - Frame 160–180: Packet travels TLD→AuthNS
  - Frame 180–220: Response packet travels back AuthNS→Browser (different color, COLORS.GREEN)
  - Frame 220–260: "IP: 93.184.216.34" node fades in with a glow effect (box-shadow or SVG filter)
  - Frame 260–300: Caption text "IP address found!" appears with `AnimatedText`
- Title "Step 1: DNS Lookup" in top-left using `AnimatedText` at frame 0

### Dependencies
TASK-003, TASK-004

### Validation
```powershell
Test-Path "remotion-url-explainer\src\scenes\Scene03DNS.tsx" # True
npx tsc --noEmit  # 0 errors
```

### Definition of Done
- File compiles; all diagram elements present at correct frame offsets

### Status
PENDING

---

## TASK-009 — Implement Scene 04: TCP Handshake + TLS

### Objective
Animate the TCP three-way handshake (SYN, SYN-ACK, ACK) between a client and server, followed by a TLS lock icon appearing to represent HTTPS encryption.

### Files
- `remotion-url-explainer/src/scenes/Scene04TCPHandshake.tsx` (create)

### Requirements
- Local frame offset: `useCurrentFrame() - startFrom` (startFrom = 660)
- Duration: 300 local frames (10 seconds)
- Layout: two `DiagramNode` boxes side by side — "Your Browser" (left, x=250, y=500) and "Server" (right, x=1650, y=500) — rendered in SVG
- A horizontal dashed line between them (y=500) represents the network
- Animation sequence (local frames):
  - Frame 0–10: Both nodes appear, title "Step 2: TCP Handshake" appears (top-left, `AnimatedText`)
  - Frame 10–50: SYN packet travels left→right; label "SYN" above packet; `LabeledArrow` draws from Browser→Server
  - Frame 50–90: SYN-ACK packet travels right→left; label "SYN-ACK"; `LabeledArrow` draws from Server→Browser; color AMBER
  - Frame 90–130: ACK packet travels left→right; label "ACK"; color GREEN
  - Frame 130–160: Caption "Connection Established!" appears centered, GREEN, bold
  - Frame 160–180: Scene dims slightly; new label "Step 3: TLS Handshake" fades in
  - Frame 180–240: Three more packet pairs animate (abbreviated — just 2 packets each direction, labeled "TLS Hello" and "Certificate") using same packet/arrow pattern
  - Frame 240–280: A padlock SVG icon (inline SVG path for a simple lock) scales in from 0 to 1 using `spring()` at center of screen; text "Encrypted!" in GREEN
  - Frame 280–300: All elements fade out
- The padlock must be pure inline SVG path, no external assets

### Dependencies
TASK-003, TASK-004

### Validation
```powershell
Test-Path "remotion-url-explainer\src\scenes\Scene04TCPHandshake.tsx" # True
npx tsc --noEmit  # 0 errors
```

### Definition of Done
- File compiles; TCP and TLS animation steps are correctly sequenced

### Status
PENDING

---

## TASK-010 — Implement Scene 05: HTTP Request & Response

### Objective
Show the browser sending an HTTP GET request and receiving an HTML response, with a visual representation of the request/response headers and a payload preview.

### Files
- `remotion-url-explainer/src/scenes/Scene05HTTPRequest.tsx` (create)

### Requirements
- Local frame offset: `useCurrentFrame() - startFrom` (startFrom = 960)
- Duration: 360 local frames (12 seconds)
- Layout: split screen — left half shows "Browser" panel, right half shows "Server" panel, separated by a vertical dashed line
- Animation sequence (local frames):
  - Frame 0–10: Title "Step 4: HTTP Request" appears top-left
  - Frame 10–60: In the left panel, use `CodeLine` to type out an HTTP request (3 lines, staggered):
    - Line 1 (startFrame=10): `GET /index.html HTTP/1.1`
    - Line 2 (startFrame=30): `Host: example.com`
    - Line 3 (startFrame=50): `Accept: text/html`
  - Frame 60–100: `NetworkPacket` travels from left panel → right panel (wide, horizontal path)
  - Frame 100–160: Server panel shows processing — a `ProgressBar` fills up (label: "Processing Request...")
  - Frame 160–220: In right panel, `CodeLine` types out HTTP response headers:
    - Line 1 (startFrame=160): `HTTP/1.1 200 OK`
    - Line 2 (startFrame=180): `Content-Type: text/html`
    - Line 3 (startFrame=200): `Content-Length: 1234`
  - Frame 220–260: `NetworkPacket` travels right → left (color GREEN, label "Response")
  - Frame 260–320: In left panel, a simplified HTML snippet types in using `CodeLine`:
    - `<!DOCTYPE html>`
    - `<html>`
    - `  <head>...</head>`
    - `  <body>...</body>`
    - `</html>`
    Each line staggered by 12 frames
  - Frame 320–360: Caption "Browser received HTML!" fades in, GREEN

### Dependencies
TASK-003, TASK-004, TASK-005

### Validation
```powershell
Test-Path "remotion-url-explainer\src\scenes\Scene05HTTPRequest.tsx" # True
npx tsc --noEmit  # 0 errors
```

### Definition of Done
- File compiles; all CodeLine, NetworkPacket, and ProgressBar usages are correctly timed

### Status
PENDING

---

## TASK-011 — Implement Scene 06: Browser Rendering

### Objective
Animate the browser rendering pipeline: HTML parsing → DOM tree → CSSOM → Layout → Paint → Composite → Final webpage appears.

### Files
- `remotion-url-explainer/src/scenes/Scene06Rendering.tsx` (create)

### Requirements
- Local frame offset: `useCurrentFrame() - startFrom` (startFrom = 1320)
- Duration: 300 local frames (10 seconds)
- Layout: vertical pipeline visualization centered on screen, each step as a `DiagramNode` box connected by `LabeledArrow`
- Pipeline steps (rendered as stacked `DiagramNode` boxes, appearing sequentially):
  1. "HTML Parsing" — color CYAN
  2. "DOM Tree" — color CYAN  
  3. "CSS Parsing → CSSOM" — color PURPLE
  4. "Render Tree" — color AMBER
  5. "Layout" — color AMBER
  6. "Paint" — color GREEN
  7. "Composite" — color GREEN
- Each node appears with a 25-frame stagger (node 1 at frame 0, node 2 at frame 25, etc.)
- `LabeledArrow` between each pair of nodes draws on immediately after each node appears
- At frame 200: all pipeline nodes pulse (scale 1→1.05→1 using `spring()` back to 1) simultaneously
- At frame 220: a mock webpage thumbnail (a simple inline SVG rectangle with colored boxes representing header/content/footer: gray bar top, two colored rectangles middle, gray bar bottom) scales in from 0 using `spring()` on the right half of the screen
- Caption "Page Rendered!" at frame 250, GREEN, centered below

### Dependencies
TASK-003, TASK-004

### Validation
```powershell
Test-Path "remotion-url-explainer\src\scenes\Scene06Rendering.tsx" # True
npx tsc --noEmit  # 0 errors
```

### Definition of Done
- File compiles; pipeline node stagger and final webpage reveal are correctly implemented

### Status
PENDING

---

## TASK-012 — Implement Scene 07: Outro / Summary

### Objective
Build the closing scene that recaps all 4 steps with icons and a final call-to-action.

### Files
- `remotion-url-explainer/src/scenes/Scene07Outro.tsx` (create)

### Requirements
- Local frame offset: `useCurrentFrame() - startFrom` (startFrom = 1620)
- Duration: 180 local frames (6 seconds)
- Background: same radial gradient as Scene 01
- Layout: center of screen
- Elements:
  - Frame 0–20: Title "How a URL Loads a Webpage" slides in from top using `AnimatedText`
  - Frame 20–50: Four summary items appear sequentially (staggered by 15 frames each), each as a row:
    - "1. DNS Lookup — Find the IP"
    - "2. TCP Handshake — Connect to Server"
    - "3. HTTP Request — Ask for Page"
    - "4. Browser Renders — Display Page"
  - Each item uses `AnimatedText` with `direction='left'`
  - Frame 110–140: A horizontal cyan divider line animates width 0→600px
  - Frame 140–170: Final text "All in under 100ms!" fades in, large, bold, CYAN, centered
  - Frame 165–180: All elements fade out smoothly to black (use `interpolate` on overall container opacity)

### Dependencies
TASK-003, TASK-006

### Validation
```powershell
Test-Path "remotion-url-explainer\src\scenes\Scene07Outro.tsx" # True
npx tsc --noEmit  # 0 errors
```

### Definition of Done
- File compiles; all summary items and fade-out are correctly sequenced

### Status
PENDING

---

## TASK-013 — Assemble main composition and wire all scenes

### Objective
Create the main `UrlExplainer.tsx` composition that renders all 7 scenes at their correct frame offsets, with `SceneTransition` wipes between each scene. Update `Root.tsx` to import this real component.

### Files
- `remotion-url-explainer/src/UrlExplainer.tsx` (create)
- `remotion-url-explainer/src/Root.tsx` (modify — replace placeholder import)

### Requirements

**`UrlExplainer.tsx`**:
- Uses `useCurrentFrame()` and `useVideoConfig()`
- Renders all 7 scene components using `SCENES` constants for `startFrom` values:
  ```tsx
  import { SCENES } from './constants';
  // Each scene is conditionally rendered based on frame range
  ```
- Each scene is rendered only when `frame >= SCENES.X.start && frame < SCENES.X.end` to avoid unnecessary rendering
- Wraps everything in a `<div>` with `position: 'relative'`, `width: '100%'`, `height: '100%'`, `background: COLORS.BG`, `overflow: 'hidden'`, `fontFamily: FONT_FAMILY`
- Places `SceneTransition` components at each scene boundary:
  - Transition at frame 105 (end of Scene01, 15-frame overlap)
  - Transition at frame 345
  - Transition at frame 645
  - Transition at frame 945
  - Transition at frame 1305
  - Transition at frame 1605
- Each `SceneTransition` uses `color={COLORS.CYAN}` and `durationFrames={15}`

**`Root.tsx` update**:
- Replace the inline placeholder component with: `import { UrlExplainer } from './UrlExplainer'`
- All other content in `Root.tsx` remains the same

### Dependencies
TASK-006, TASK-007, TASK-008, TASK-009, TASK-010, TASK-011, TASK-012

### Validation
```powershell
Test-Path "remotion-url-explainer\src\UrlExplainer.tsx" # True
npx tsc --noEmit  # 0 errors
```

### Definition of Done
- `UrlExplainer.tsx` exists and imports all 7 scenes
- `Root.tsx` imports `UrlExplainer` (not the placeholder)
- `npx tsc --noEmit` exits with code 0

### Status
PENDING

---

## TASK-014 — Verify Remotion Studio launches without errors

### Objective
Confirm the assembled project starts in Remotion Studio without TypeScript or runtime errors. Verify the composition appears and is selectable.

### Files
No new files. Read-only validation step.

### Requirements
- Run `npx remotion studio` (or `npm start`) inside `remotion-url-explainer/`
- The CLI must output a localhost URL (e.g., `http://localhost:3000`)
- No TypeScript compilation errors in console output
- The composition `UrlExplainer` must appear in the sidebar at 1920×1080, 1800 frames
- Kill the process after confirming startup (within 30 seconds)

### Dependencies
TASK-013

### Validation
```powershell
# Start studio in background and check output
$job = Start-Job -ScriptBlock { npm start } -WorkingDirectory "remotion-url-explainer"
Start-Sleep -Seconds 20
$output = Receive-Job $job
$output | Select-String "localhost"  # Must match
Stop-Job $job; Remove-Job $job
```
Alternatively, run `npx tsc --noEmit` as a final compile check:
```powershell
npx tsc --noEmit  # 0 errors
```

### Definition of Done
- `npx tsc --noEmit` exits with code 0
- All scene and component files exist (verified by `Test-Path`)
- Remotion Studio launches without crashing (localhost URL visible in output)

### Status
PENDING

---

## TASK-015 — Configure render output and validate render command

### Objective
Verify the render command works end-to-end and produces a valid MP4 file at 1920×1080.

### Files
- `remotion-url-explainer/package.json` (verify render script — modify if needed)

### Requirements
- Ensure `out/` directory exists or is created by the render command automatically
- Run a short test render of just the first 120 frames (Scene 01 only) to save time:
  ```powershell
  npx remotion render UrlExplainer out/test-render.mp4 --frames=0-120
  ```
- The output file `out/test-render.mp4` must:
  - Exist
  - Be > 100KB in size
  - Be a valid MP4 (check with `ffprobe` if available, or just file size check)
- If the render script in `package.json` uses `--frames=0-1799`, add a separate `"render:test"` script for frames 0-120

### Dependencies
TASK-014

### Validation
```powershell
Test-Path "remotion-url-explainer\out\test-render.mp4"  # True
(Get-Item "remotion-url-explainer\out\test-render.mp4").Length -gt 100000  # True
```

### Definition of Done
- `out/test-render.mp4` exists and is > 100KB
- No render errors in console output

### Status
PENDING

---

## Current Status
TASK-003 — In Progress

## Task Summary

| Task    | Title                                        | Depends On          | Status  |
|---------|----------------------------------------------|---------------------|---------|
| TASK-001 | Initialize Remotion TypeScript project      | —                   | COMPLETED |
| TASK-002 | Create constants, types, and Root           | TASK-001            | COMPLETED |
| TASK-003 | AnimatedText + SceneTransition components   | TASK-002            | PENDING |
| TASK-004 | NetworkPacket + DiagramNode + LabeledArrow  | TASK-002            | PENDING |
| TASK-005 | CodeLine + BrowserWindow + ProgressBar      | TASK-002            | PENDING |
| TASK-006 | Scene 01: Title Card                        | TASK-003, TASK-005  | PENDING |
| TASK-007 | Scene 02: Typing the URL                    | TASK-003, TASK-005  | PENDING |
| TASK-008 | Scene 03: DNS Lookup                        | TASK-003, TASK-004  | PENDING |
| TASK-009 | Scene 04: TCP Handshake + TLS               | TASK-003, TASK-004  | PENDING |
| TASK-010 | Scene 05: HTTP Request & Response           | TASK-003–TASK-005   | PENDING |
| TASK-011 | Scene 06: Browser Rendering                 | TASK-003, TASK-004  | PENDING |
| TASK-012 | Scene 07: Outro / Summary                   | TASK-003, TASK-006  | PENDING |
| TASK-013 | Assemble main UrlExplainer composition      | TASK-006–TASK-012   | PENDING |
| TASK-014 | Verify Remotion Studio launches             | TASK-013            | PENDING |
| TASK-015 | Configure and validate render output        | TASK-014            | PENDING |
