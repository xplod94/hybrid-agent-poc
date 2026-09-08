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
