import { Vector3, Player, GameWorld, Obstacle } from '../../types';
import { GAME_CONFIG } from '../../constants';

export class PhysicsEngine {
  applyGravity(player: Player, world: GameWorld, deltaTime: number): void {
    const gravity = world.gravityDirection;
    const gravityForce = GAME_CONFIG.GRAVITY_STRENGTH * deltaTime;

    player.velocity.y += gravity.y * gravityForce;
  }

  updatePosition(player: Player, deltaTime: number): void {
    player.position.x += player.velocity.x * deltaTime;
    player.position.y += player.velocity.y * deltaTime;
    player.position.z += player.velocity.z * deltaTime;
  }

  jump(player: Player, world: GameWorld): boolean {
    if (player.isGrounded) {
      const jumpForce = GAME_CONFIG.JUMP_FORCE;
      // 점프는 현재 중력의 반대 방향으로 작용
      player.velocity.y -= world.gravityDirection.y * jumpForce;
      player.isGrounded = false;
      return true;
    }
    return false;
  }

  doubleJump(player: Player, world: GameWorld): boolean {
    // 이 로직은 현재 중력 전환으로 사용됨
    return false;
  }

  checkGroundCollision(player: Player, world: GameWorld): void {
    const playerSize = GAME_CONFIG.PLAYER_SIZE;
    const centerY = world.centerLineY;

    player.isGrounded = false;

    // 플레이어가 선 위에 있어야 하는 경우 (중력이 아래로 향함)
    if (player.isOnTop) {
      if (player.velocity.y >= 0 && player.position.y + playerSize >= centerY) {
        player.position.y = centerY - playerSize;
        player.velocity.y = 0;
        player.isGrounded = true;
      }
    } 
    // 플레이어가 선 아래에 있어야 하는 경우 (중력이 위로 향함)
    else {
      if (player.velocity.y <= 0 && player.position.y <= centerY) {
        player.position.y = centerY;
        player.velocity.y = 0;
        player.isGrounded = true;
      }
    }
  }

  // 장애물 충돌 체크 (중심점 기준)
  checkObstacleCollision(player: Player, obstacles: Obstacle[]): Obstacle | null {
    const playerHalfSize = GAME_CONFIG.PLAYER_SIZE / 2;
    const playerBounds = {
      minX: player.position.x - playerHalfSize,
      maxX: player.position.x + playerHalfSize,
      minY: player.position.y - playerHalfSize,
      maxY: player.position.y + playerHalfSize,
      minZ: player.position.z - playerHalfSize,
      maxZ: player.position.z + playerHalfSize,
    };

    for (const obstacle of obstacles) {
      const obstacleHalfSize = { x: obstacle.size.x / 2, y: obstacle.size.y / 2, z: obstacle.size.z / 2 };
      const obstacleBounds = {
        minX: obstacle.position.x - obstacleHalfSize.x,
        maxX: obstacle.position.x + obstacleHalfSize.x,
        minY: obstacle.position.y - obstacleHalfSize.y,
        maxY: obstacle.position.y + obstacleHalfSize.y,
        minZ: obstacle.position.z - obstacleHalfSize.z,
        maxZ: obstacle.position.z + obstacleHalfSize.z,
      };

      // AABB 충돌 감지 (중심점 기준)
      if (
        playerBounds.maxX > obstacleBounds.minX &&
        playerBounds.minX < obstacleBounds.maxX &&
        playerBounds.maxY > obstacleBounds.minY &&
        playerBounds.minY < obstacleBounds.maxY &&
        playerBounds.maxZ > obstacleBounds.minZ &&
        playerBounds.minZ < obstacleBounds.maxZ
      ) {
        return obstacle;
      }
    }
    return null;
  }
}