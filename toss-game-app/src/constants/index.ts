// Game Constants
export const GAME_CONFIG = {
  GRAVITY_STRENGTH: 9.8,
  JUMP_FORCE: 12,
  DOUBLE_JUMP_FORCE: 10,
  MOVE_SPEED: 5,
  WORLD_SIZE: 10,
  ROTATION_DURATION: 1000, // ms
  DOUBLE_TAP_THRESHOLD: 300, // ms
} as const;

export const WORLD_ROTATIONS = {
  NORMAL: 0,
  RIGHT: 90,
  INVERTED: 180,
  LEFT: 270,
} as const;

export const GRAVITY_DIRECTIONS = {
  [WORLD_ROTATIONS.NORMAL]: { x: 0, y: -1, z: 0 },
  [WORLD_ROTATIONS.RIGHT]: { x: 1, y: 0, z: 0 },
  [WORLD_ROTATIONS.INVERTED]: { x: 0, y: 1, z: 0 },
  [WORLD_ROTATIONS.LEFT]: { x: -1, y: 0, z: 0 },
} as const;