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
  isOnTop: boolean; // 플레이어가 선 위에 있는지 여부
  canDoubleJump: boolean;
  hasUsedDoubleJump: boolean;
  hp: number;
  maxHp: number;
}

export interface GameWorld {
  gravityDirection: Vector3; // 3D 중력 벡터
  gravityZone: 'upper' | 'lower'; // 현재 플레이어가 있는 구역
  centerLineY: number; // 중력 구분선 Y 좌표
}

export type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';

export interface TouchInput {
  isTouching: boolean;
  touchCount: number;
  lastTouchTime: number;
  doubleTapWindow: number; // 더블탭 감지 시간 윈도우
}

export interface Obstacle {
  id: string;
  position: Vector3;
  size: Vector3;
  type: 'spike' | 'block' | 'saw';
}

export interface DeviceOrientation {
  roll: number;
  pitch: number;
  yaw: number;
}