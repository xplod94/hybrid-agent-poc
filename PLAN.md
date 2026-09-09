# Project Implementation Plan

## Project Overview

**Project:** How a URL Loads a Webpage

**Objective:** Create a 60-second faceless animated explainer video demonstrating how a URL loads a webpage.

**Technology:**

* Remotion 4.x
* React
* TypeScript

**Output:**

* Resolution: 1920×1080
* Frame rate: 30 FPS
* Duration: 1800 frames / 60 seconds

---

# Architecture Overview

## Scene Map

| Scene | Title                   | Start Frame | End Frame | Duration |
| ----- | ----------------------- | ----------: | --------: | -------: |
| 01    | Title Card              |           0 |       120 |      4 s |
| 02    | Typing the URL          |         120 |       360 |      8 s |
| 03    | DNS Lookup              |         360 |       660 |     10 s |
| 04    | TCP Handshake + TLS     |         660 |       960 |     10 s |
| 05    | HTTP Request & Response |         960 |      1320 |     12 s |
| 06    | Browser Rendering       |        1320 |      1620 |     10 s |
| 07    | Outro / Summary         |        1620 |      1800 |      6 s |

## Design System

* **Background:** `#0A0E1A`
* **Accent 1:** `#00D4FF` — network data
* **Accent 2:** `#7C3AED` — browser UI chrome
* **Accent 3:** `#10B981` — success/response
* **Warning:** `#F59E0B` — in-transit
* **Font:** Inter
* **Animation:** Remotion `interpolate`, `spring`, `useCurrentFrame`, `useVideoConfig`

## Reusable Components

* `AnimatedText` — text fade-in/slide with configurable direction and delay
* `SceneTransition` — slide-wipe left-to-right transition between scenes
* `NetworkPacket` — animated dot/packet travelling along an SVG path
* `DiagramNode` — rectangular or circular labeled box for network diagrams
* `LabeledArrow` — SVG arrow with a text label for diagram connections
* `CodeLine` — text that types itself character-by-character
* `BrowserWindow` — mock browser chrome frame with address bar
* `ProgressBar` — horizontal fill bar for loading/progress animations

## File Structure

```text
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

# Architecture Decisions

1. **Remotion 4.x** — use `@remotion/cli` and `remotion` packages.
2. **TypeScript strict mode** — all files use `.tsx`, `strict: true` in `tsconfig`.
3. **No external animation libraries** — use only Remotion's built-in `interpolate`, `spring`, `useCurrentFrame`, `useVideoConfig` hooks to keep the bundle minimal.
4. **SVG for diagrams** — all network diagrams are rendered as inline SVG inside React components, no images needed.
5. **Google Fonts via `@remotion/google-fonts`** — ensures font is bundled into the render output.
6. **Single composition** — one `UrlExplainer` composition of 1800 frames; scenes are React components rendered sequentially using frame offsets.
7. **Scene isolation** — each scene component receives `startFrom` frame offset from `constants.ts`; it internally uses `useCurrentFrame()` minus the offset.
8. **Transitions** — `SceneTransition` component wraps scene boundaries, animating 15-frame overlap wipes.

---

# Execution Rules

## Source of Truth

* `PLAN.md` defines the implementation contract and task lifecycle.
* `STATE.md` stores persistent runtime and project memory.

## Task Execution

* Only one task may be `IN_PROGRESS` at one time.
* Tasks must execute sequentially unless dependencies explicitly permit otherwise.
* A Worker invocation executes exactly one task.
* The Worker must stop after completing or blocking/flagging its assigned task.
* The Orchestrator owns workflow routing.
* The Architect owns complex planning and task-definition repair.
* The Debugger owns blocker diagnosis and recovery planning.
* The Worker owns implementation.

## Allowed Task Statuses

```text
PENDING
IN_PROGRESS
AMBIGUOUS
COMPLETED
BLOCKED
```

## Status Semantics

```text
PENDING
    Task is defined and waiting for execution.

IN_PROGRESS
    Worker is actively executing the task.

AMBIGUOUS
    Worker cannot safely execute the task because its specification is
    incomplete, contradictory, or requires an architectural/product decision.
    The Orchestrator routes the task to the Architect.

BLOCKED
    Worker understands the task but cannot complete it because of a
    technical, environmental, dependency, or validation failure.
    The Orchestrator routes the task to the Debugger.

COMPLETED
    Worker completed the task and the specified validation passed.
```

## Valid State Transitions

```text
PENDING → IN_PROGRESS
              ├→ COMPLETED
              ├→ AMBIGUOUS → Architect → PENDING
              └→ BLOCKED → Debugger → PENDING
```

A task must not proceed to a dependent task while it is `AMBIGUOUS` or `BLOCKED`.

---

# Tasks

## TASK-001 — Initialize Remotion TypeScript project

### Objective

Scaffold a new Remotion project inside `remotion-url-explainer/` subdirectory within the workspace, configured for TypeScript with all required dependencies installed.

### Files

* `remotion-url-explainer/package.json`
* `remotion-url-explainer/tsconfig.json`
* `remotion-url-explainer/remotion.config.ts`
* `remotion-url-explainer/.gitignore`

### Requirements

* Run inside workspace root: `C:\Users\Pranav\ai-projects\opencode-hybrid-poc`
* Create directory `remotion-url-explainer`
* `package.json` must include:

  * `"name": "remotion-url-explainer"`
  * `"version": "1.0.0"`
  * dependencies: `"remotion": "^4.0.0"`, `"react": "^18.0.0"`, `"react-dom": "^18.0.0"`, `"@remotion/cli": "^4.0.0"`, `"@remotion/google-fonts": "^4.0.0"`
  * devDependencies: `"typescript": "^5.0.0"`, `"@types/react": "^18.0.0"`, `"@types/react-dom": "^18.0.0"`
  * scripts: `"start": "remotion studio"`, `"build": "remotion bundle"`, `"render": "remotion render UrlExplainer out/explainer.mp4"`
* `tsconfig.json` must set:

  * `"strict": true`
  * `"jsx": "react-jsx"`
  * `"module": "ESNext"`
  * `"target": "ES2020"`
  * `"moduleResolution": "bundler"`
  * `"include": ["src"]`
* `remotion.config.ts` must call `Config.setVideoImageFormat("png")` and `Config.setCodec("h264")`
* `.gitignore` must exclude `node_modules/`, `out/`, `.remotion/`
* Run `npm install` inside `remotion-url-explainer/` to install dependencies

### Dependencies

None.

### Validation

```powershell
Test-Path "remotion-url-explainer\package.json"
Test-Path "remotion-url-explainer\tsconfig.json"
Test-Path "remotion-url-explainer\remotion.config.ts"
Test-Path "remotion-url-explainer\node_modules\remotion"
```

### Definition of Done

* All four files exist with correct content
* `npm install` exits with code 0
* `node_modules/remotion` directory exists

### Status

COMPLETED

---

## TASK-002 — Create constants, types, and Root composition

### Objective

Create the foundational shared files: `constants.ts` with all timing/color/design tokens, `types.ts` with shared TypeScript interfaces, and `Root.tsx` registering the single Remotion composition.

### Files

* `remotion-url-explainer/src/constants.ts`
* `remotion-url-explainer/src/types.ts`
* `remotion-url-explainer/src/Root.tsx`

### Requirements

**`constants.ts`** must export:

```typescript
export const FPS = 30;
export const DURATION_IN_FRAMES = 1800;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const SCENES = {
  TITLE:      { start: 0,    end: 120  },
  TYPING_URL: { start: 120, end: 360  },
  DNS:        { start: 360, end: 660  },
  TCP:        { start: 660, end: 960  },
  HTTP:       { start: 960, end: 1320 },
  RENDERING:  { start: 1320, end: 1620 },
  OUTRO:      { start: 1620, end: 1800 },
} as const;

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

export const TRANSITION_FRAMES = 15;
```

**`types.ts`** must export:

```typescript
export interface SceneProps {
  startFrom: number;
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

* Import `Composition` from `remotion`
* Define a placeholder `UrlExplainer` component with dark background
* Register one `UrlExplainer` composition using the constants above

### Dependencies

TASK-001

### Validation

```powershell
Test-Path "remotion-url-explainer\src\constants.ts"
Test-Path "remotion-url-explainer\src\types.ts"
Test-Path "remotion-url-explainer\src\Root.tsx"

npx tsc --noEmit
```

### Definition of Done

* All three files exist with correct content
* `npx tsc --noEmit` exits with code 0

### Status

COMPLETED

---

## TASK-003 — Build AnimatedText and SceneTransition components

### Objective

Create the two most-used utility components: `AnimatedText` and `SceneTransition`.

### Files

* `remotion-url-explainer/src/components/AnimatedText.tsx`
* `remotion-url-explainer/src/components/SceneTransition.tsx`

### Requirements

**`AnimatedText.tsx`:**

Props interface:

```typescript
interface AnimatedTextProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  style?: React.CSSProperties;
}
```

* Uses `useCurrentFrame()` and `interpolate()` from `remotion`
* Animation: opacity 0 + translation offset to opacity 1 + translate 0 over 20 frames after delay
* Use `spring()` for translate value
* Use `extrapolateLeft: 'clamp'` and `extrapolateRight: 'clamp'`
* `direction` maps to the appropriate CSS translate axis and direction

**`SceneTransition.tsx`:**

Props interface:

```typescript
interface SceneTransitionProps {
  startFrame: number;
  durationFrames?: number;
  direction?: 'left' | 'right';
  color?: string;
}
```

* Uses `useCurrentFrame()`
* Renders a full-screen `position: absolute` div
* Slides across from one edge, covers the screen at midpoint, then slides off the other edge
* Uses a two-phase wipe:

  * In: `0 → durationFrames / 2`
  * Out: `durationFrames / 2 → durationFrames`
* Uses `interpolate()` with clamped extrapolation

### Dependencies

TASK-002

### Validation

```powershell
Test-Path "remotion-url-explainer\src\components\AnimatedText.tsx"
Test-Path "remotion-url-explainer\src\components\SceneTransition.tsx"

npx tsc --noEmit
```

### Definition of Done

* Both files exist with no TypeScript errors
* `AnimatedText` renders children with slide and fade animation
* `SceneTransition` renders a full-width colored wipe overlay

### Status

COMPLETED

---

## TASK-004 — Build NetworkPacket, DiagramNode, and LabeledArrow components

### Objective

Create the three SVG-based diagram components used across the DNS and TCP scenes.

### Files

* `remotion-url-explainer/src/components/NetworkPacket.tsx`
* `remotion-url-explainer/src/components/DiagramNode.tsx`
* `remotion-url-explainer/src/components/LabeledArrow.tsx`

### Requirements

Create reusable SVG-based components suitable for network diagrams and packet animations.

* `NetworkPacket` must animate a packet along an SVG path using Remotion frame hooks.
* `DiagramNode` must render reusable labeled diagram nodes with configurable positioning and color.
* `LabeledArrow` must render SVG directional connections with optional labels and animated drawing support.
* Components must be reusable across Scene 03 and Scene 04.
* Use Remotion animation primitives rather than external animation libraries.

### Dependencies

TASK-002

### Validation

```powershell
Test-Path "remotion-url-explainer\src\components\NetworkPacket.tsx"
Test-Path "remotion-url-explainer\src\components\DiagramNode.tsx"
Test-Path "remotion-url-explainer\src\components\LabeledArrow.tsx"

npx tsc --noEmit
```

### Definition of Done

* All three files exist with no TypeScript errors
* Each component correctly uses Remotion hooks

### Status

COMPLETED

---

## TASK-005 — Build CodeLine, BrowserWindow, and ProgressBar components

### Objective

Create the three remaining reusable components: a typewriter-effect code line, a mock browser chrome frame, and a fill progress bar.

### Files

* `remotion-url-explainer/src/components/CodeLine.tsx`
* `remotion-url-explainer/src/components/BrowserWindow.tsx`
* `remotion-url-explainer/src/components/ProgressBar.tsx`

### Requirements

**`CodeLine.tsx`:**

```typescript
interface CodeLineProps {
  text: string;
  startFrame: number;
  charsPerFrame?: number;
  color?: string;
  style?: React.CSSProperties;
}
```

* Uses `useCurrentFrame()`
* Calculates visible characters with:
  `Math.floor((frame - startFrame) * charsPerFrame)`
* Renders `text.slice(0, visibleChars)` in a monospace font
* Appends a blinking `|` cursor
* Do not require an external CSS file

**`BrowserWindow.tsx`:**

```typescript
interface BrowserWindowProps {
  url?: string;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  showCursor?: boolean;
  urlRevealFrame?: number;
}
```

* Mock browser window with dark chrome header
* Three colored circles
* Rounded address bar
* Content area below
* If `urlRevealFrame` is set, URL types in with character reveal logic

**`ProgressBar.tsx`:**

```typescript
interface ProgressBarProps {
  startFrame: number;
  durationFrames: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  width?: number;
  label?: string;
  style?: React.CSSProperties;
}
```

* Uses `interpolate()` to animate width from 0% to 100%
* Renders outer container and inner fill with rounded corners

### Dependencies

TASK-002

### Validation

```powershell
Test-Path "remotion-url-explainer\src\components\CodeLine.tsx"
Test-Path "remotion-url-explainer\src\components\BrowserWindow.tsx"
Test-Path "remotion-url-explainer\src\components\ProgressBar.tsx"

npx tsc --noEmit
```

### Definition of Done

* All three files exist with no TypeScript errors
* Components use Remotion animation primitives correctly

### Status

PENDING

---

## TASK-006 — Implement Scene 01: Title Card

### Objective

Build the opening scene that introduces the video title with animated text and a glowing background.

### Files

* `remotion-url-explainer/src/scenes/Scene01Title.tsx`

### Requirements

* Receives `SceneProps`
* Local frame:
  `const frame = useCurrentFrame() - startFrom`
* Background: `COLORS.BG` with subtle radial gradient glow
* Animate:

  1. "Explainer Series" at frame 0
  2. "How a URL Loads a Webpage" at frame 10, 96px, bold
  3. Cyan accent line at frame 25
  4. `https://example.com` at frame 40
* Use clamped interpolation
* Fade all elements out during local frames 90–120

### Dependencies

TASK-003, TASK-005

### Validation

```powershell
Test-Path "remotion-url-explainer\src\scenes\Scene01Title.tsx"

npx tsc --noEmit
```

### Definition of Done

* File exists and compiles
* Scene renders animated title card

### Status

PENDING

---

## TASK-007 — Implement Scene 02: Typing the URL

### Objective

Animate a browser window where the user types `https://example.com`, then highlights and labels URL parts.

### Files

* `remotion-url-explainer/src/scenes/Scene02TypingURL.tsx`

### Requirements

* Local frame offset: `useCurrentFrame() - startFrom`
* `startFrom = 120`
* Duration: 240 frames
* Center `BrowserWindow` at width 1400 and height 750
* Animation sequence:

  * Frame 0–60: Type `https://example.com`
  * Highlight URL components:

    * `https://` — scheme
    * `example` — domain
    * `.com` — TLD
  * Labels appear with `AnimatedText`
  * Final caption: "Let's see what happens next..."
* Highlights use absolutely positioned underline bars
* Labels appear above or below highlights

### Dependencies

TASK-003, TASK-005, TASK-006

### Validation

```powershell
Test-Path "remotion-url-explainer\src\scenes\Scene02TypingURL.tsx"

npx tsc --noEmit
```

### Definition of Done

* File compiles
* Scene sequence uses correct local frame timing

### Status

PENDING

---

## TASK-008 — Implement Scene 03: DNS Lookup

### Objective

Build an animated network diagram showing the DNS resolution chain.

### Files

* `remotion-url-explainer/src/scenes/Scene03DNS.tsx`

### Requirements

* Local frame offset: `useCurrentFrame() - startFrom`
* `startFrom = 360`
* Duration: 300 frames
* Full-screen dark background with SVG diagram
* Nodes:

  * Browser at `(200, 400)`, PURPLE
  * DNS Resolver at `(500, 200)`, CYAN
  * Root NS at `(800, 400)`, AMBER
  * TLD NS (.com) at `(1100, 200)`, AMBER
  * Auth NS (example.com) at `(1400, 400)`, GREEN
  * IP: `93.184.216.34` at `(960, 700)`, GREEN
* Animation:

  * Browser appears
  * DNS Resolver appears and arrow draws
  * Query packet travels
  * Root NS → TLD → Auth NS chain appears
  * Response packet returns
  * IP node fades in with glow
  * "IP address found!" caption appears
* Title: "Step 1: DNS Lookup"

### Dependencies

TASK-003, TASK-004

### Validation

```powershell
Test-Path "remotion-url-explainer\src\scenes\Scene03DNS.tsx"

npx tsc --noEmit
```

### Definition of Done

* File compiles
* Diagram elements appear at correct frame offsets

### Status

PENDING

---

## TASK-009 — Implement Scene 04: TCP Handshake + TLS

### Objective

Animate the TCP three-way handshake followed by TLS encryption.

### Files

* `remotion-url-explainer/src/scenes/Scene04TCPHandshake.tsx`

### Requirements

* Local frame offset with `startFrom = 660`
* Duration: 300 frames
* Browser node at left
* Server node at right
* Horizontal dashed network line
* Animation:

  * SYN packet
  * SYN-ACK packet
  * ACK packet
  * "Connection Established!"
  * TLS handshake label
  * TLS Hello and Certificate packets
  * Inline SVG padlock scales in
  * "Encrypted!" caption
  * Fade out
* No external assets for padlock

### Dependencies

TASK-003, TASK-004

### Validation

```powershell
Test-Path "remotion-url-explainer\src\scenes\Scene04TCPHandshake.tsx"

npx tsc --noEmit
```

### Definition of Done

* File compiles
* TCP and TLS sequences are correctly timed

### Status

PENDING

---

## TASK-010 — Implement Scene 05: HTTP Request & Response

### Objective

Show the browser sending an HTTP GET request and receiving an HTML response.

### Files

* `remotion-url-explainer/src/scenes/Scene05HTTPRequest.tsx`

### Requirements

* Local frame offset with `startFrom = 960`
* Duration: 360 frames
* Split screen:

  * Browser panel
  * Server panel
* Sequence:

  * HTTP GET request typed with `CodeLine`
  * Packet travels Browser → Server
  * Server processing with `ProgressBar`
  * HTTP response headers typed
  * Response packet travels Server → Browser
  * Simplified HTML snippet types in
  * "Browser received HTML!" caption

Request lines:

```text
GET /index.html HTTP/1.1
Host: example.com
Accept: text/html
```

Response lines:

```text
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234
```

### Dependencies

TASK-003, TASK-004, TASK-005

### Validation

```powershell
Test-Path "remotion-url-explainer\src\scenes\Scene05HTTPRequest.tsx"

npx tsc --noEmit
```

### Definition of Done

* File compiles
* `CodeLine`, `NetworkPacket`, and `ProgressBar` are correctly timed

### Status

PENDING

---

## TASK-011 — Implement Scene 06: Browser Rendering

### Objective

Animate the browser rendering pipeline.

### Files

* `remotion-url-explainer/src/scenes/Scene06Rendering.tsx`

### Requirements

* Local frame offset with `startFrom = 1320`
* Duration: 300 frames
* Pipeline:

  1. HTML Parsing — CYAN
  2. DOM Tree — CYAN
  3. CSS Parsing → CSSOM — PURPLE
  4. Render Tree — AMBER
  5. Layout — AMBER
  6. Paint — GREEN
  7. Composite — GREEN
* Each node appears with a 25-frame stagger
* `LabeledArrow` connects nodes
* Frame 200: pipeline nodes pulse
* Frame 220: inline SVG mock webpage scales in
* Frame 250: "Page Rendered!" caption

### Dependencies

TASK-003, TASK-004

### Validation

```powershell
Test-Path "remotion-url-explainer\src\scenes\Scene06Rendering.tsx"

npx tsc --noEmit
```

### Definition of Done

* File compiles
* Pipeline stagger and webpage reveal work correctly

### Status

PENDING

---

## TASK-012 — Implement Scene 07: Outro / Summary

### Objective

Build the closing scene that recaps the four steps.

### Files

* `remotion-url-explainer/src/scenes/Scene07Outro.tsx`

### Requirements

* Local frame offset with `startFrom = 1620`
* Duration: 180 frames
* Same radial gradient background as Scene 01
* Sequence:

  * Frame 0–20: Title appears
  * Frame 20–50: Summary items stagger in:

    * DNS Lookup — Find the IP
    * TCP Handshake — Connect to Server
    * HTTP Request — Ask for Page
    * Browser Renders — Display Page
  * Frame 110–140: Cyan divider expands
  * Frame 140–170: "All in under 100ms!" appears
  * Frame 165–180: Fade to black

### Dependencies

TASK-003, TASK-006

### Validation

```powershell
Test-Path "remotion-url-explainer\src\scenes\Scene07Outro.tsx"

npx tsc --noEmit
```

### Definition of Done

* File compiles
* Summary items and fade-out work correctly

### Status

PENDING

---

## TASK-013 — Assemble main composition and wire all scenes

### Objective

Create the main `UrlExplainer.tsx` composition that renders all seven scenes at correct frame offsets, with transitions between them.

### Files

* `remotion-url-explainer/src/UrlExplainer.tsx`
* `remotion-url-explainer/src/Root.tsx`

### Requirements

**`UrlExplainer.tsx`:**

* Uses `useCurrentFrame()` and `useVideoConfig()`
* Imports `SCENES`
* Renders all seven scenes
* Each scene renders only within its frame range
* Root container:

  * `position: relative`
  * `width: 100%`
  * `height: 100%`
  * `background: COLORS.BG`
  * `overflow: hidden`
  * `fontFamily: FONT_FAMILY`
* Add transitions at frames:

  * 105
  * 345
  * 645
  * 945
  * 1305
  * 1605
* Each transition uses:

  * `COLORS.CYAN`
  * `durationFrames={15}`

**`Root.tsx`:**

* Replace placeholder component with:
  `import { UrlExplainer } from './UrlExplainer'`
* Keep the rest of composition configuration unchanged

### Dependencies

TASK-006, TASK-007, TASK-008, TASK-009, TASK-010, TASK-011, TASK-012

### Validation

```powershell
Test-Path "remotion-url-explainer\src\UrlExplainer.tsx"

npx tsc --noEmit
```

### Definition of Done

* Main composition renders all seven scenes
* All scenes use correct frame ranges
* Transitions appear at scene boundaries
* TypeScript compilation succeeds

### Status

PENDING

---

## TASK-014 — Verify Remotion Studio launches

### Objective

Verify that the completed composition launches successfully in Remotion Studio.

### Files

No production files required unless fixes are necessary.

### Requirements

* Run Remotion Studio from `remotion-url-explainer/`
* Verify the `UrlExplainer` composition appears
* Verify the preview renders without crashes
* Fix only issues necessary for Studio startup and preview

### Dependencies

TASK-013

### Validation

```powershell
npm run start
```

Verify:

* Remotion Studio launches
* `UrlExplainer` composition is visible
* No runtime crash occurs

### Definition of Done

* `npx tsc --noEmit` exits with code 0
* All scene and component files exist
* Remotion Studio launches without crashing

### Status

PENDING

---

## TASK-015 — Configure render output and validate render command

### Objective

Verify the render command works end-to-end and produces a valid MP4 file at 1920×1080.

### Files

* `remotion-url-explainer/package.json` — verify render script and modify if required

### Requirements

* Ensure `out/` directory exists or is automatically created
* Run a short test render:

```powershell
npx remotion render UrlExplainer out/test-render.mp4 --frames=0-120
```

The output file must:

* Exist
* Be greater than 100KB
* Be a valid MP4

If needed, add:

```text
render:test
```

for frames `0-120`.

### Dependencies

TASK-014

### Validation

```powershell
Test-Path "remotion-url-explainer\out\test-render.mp4"

(Get-Item "remotion-url-explainer\out\test-render.mp4").Length -gt 100000
```

### Definition of Done

* `out/test-render.mp4` exists
* File is greater than 100KB
* No render errors occur

### Status

PENDING

---

# Current Execution State

## Current Task

TASK-005 — Build CodeLine, BrowserWindow, and ProgressBar components

## Project Status

READY

## Last Completed Task

TASK-004 — Build NetworkPacket, DiagramNode, and LabeledArrow components

---

# Task Summary

| Task     | Title                                         | Dependencies                 | Status    |
| -------- | --------------------------------------------- | ---------------------------- | --------- |
| TASK-001 | Initialize Remotion TypeScript project        | —                            | COMPLETED |
| TASK-002 | Create constants, types, and Root composition | TASK-001                     | COMPLETED |
| TASK-003 | AnimatedText + SceneTransition components     | TASK-002                     | COMPLETED |
| TASK-004 | NetworkPacket + DiagramNode + LabeledArrow    | TASK-002                     | COMPLETED |
| TASK-005 | CodeLine + BrowserWindow + ProgressBar        | TASK-002                     | PENDING   |
| TASK-006 | Scene 01: Title Card                          | TASK-003, TASK-005           | PENDING   |
| TASK-007 | Scene 02: Typing the URL                      | TASK-003, TASK-005, TASK-006 | PENDING   |
| TASK-008 | Scene 03: DNS Lookup                          | TASK-003, TASK-004           | PENDING   |
| TASK-009 | Scene 04: TCP Handshake + TLS                 | TASK-003, TASK-004           | PENDING   |
| TASK-010 | Scene 05: HTTP Request & Response             | TASK-003, TASK-004, TASK-005 | PENDING   |
| TASK-011 | Scene 06: Browser Rendering                   | TASK-003, TASK-004           | PENDING   |
| TASK-012 | Scene 07: Outro / Summary                     | TASK-003, TASK-006           | PENDING   |
| TASK-013 | Assemble main UrlExplainer composition        | TASK-006–TASK-012            | PENDING   |
| TASK-014 | Verify Remotion Studio launches               | TASK-013                     | PENDING   |
| TASK-015 | Configure and validate render output          | TASK-014                     | PENDING   |
