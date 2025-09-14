// Game Constants
export const GAME_CONFIG = {
  // Screen dimensions (가로 모드)
  SCREEN_WIDTH: 800,
  SCREEN_HEIGHT: 400,
  
  // Physics
  GRAVITY_STRENGTH: 800, // pixels/s²
  JUMP_FORCE: 300, // pixels/s
  DOUBLE_JUMP_FORCE: 300, // pixels/s
  MOVE_SPEED: 200, // pixels/s (자동 전진 속도)
  
  // Player
  PLAYER_SIZE: 32, // 32x32 픽셀
  PLAYER_START_X: 100, // 화면 왼쪽에 고정
  MAX_HP: 100,
  
  // Game mechanics
  DOUBLE_TAP_THRESHOLD: 300, // ms
  
  // Obstacles
  OBSTACLE_SPEED: 200, // pixels/s
  OBSTACLE_SPAWN_RATE: 2000, // ms
} as const;

export const GRAVITY_CONFIG = {
  UP: { x: 0, y: -1 }, // 위쪽 중력 (y축 음수 방향)
  DOWN: { x: 0, y: 1 }, // 아래쪽 중력 (y축 양수 방향)
} as const;