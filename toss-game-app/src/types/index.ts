// Game Types
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Player {
  position: Vector3;
  velocity: Vector3;
  isGrounded: boolean;
  canDoubleJump: boolean;
  hasUsedDoubleJump: boolean;
}

export interface GameWorld {
  rotation: number; // 0, 90, 180, 270
  gravityDirection: Vector3;
  currentSection: number;
}

export type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';

export interface TouchInput {
  isTouching: boolean;
  touchCount: number;
  lastTouchTime: number;
}

export interface DeviceOrientation {
  roll: number;
  pitch: number;
  yaw: number;
}