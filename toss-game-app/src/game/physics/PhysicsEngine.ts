import { Player, GameWorld } from '../../types';
import { GAME_CONFIG } from '../../constants';

export class PhysicsEngine {
  applyGravity(player: Player, world: GameWorld, deltaTime: number): void {
    const gravity = world.gravityDirection;
    const gravityForce = GAME_CONFIG.GRAVITY_STRENGTH * deltaTime;

    player.velocity.x += gravity.x * gravityForce;
    player.velocity.y += gravity.y * gravityForce;
    player.velocity.z += gravity.z * gravityForce;
  }

  updatePosition(player: Player, deltaTime: number): void {
    player.position.x += player.velocity.x * deltaTime;
    player.position.y += player.velocity.y * deltaTime;
    player.position.z += player.velocity.z * deltaTime;
  }

  jump(player: Player, world: GameWorld): boolean {
    if (player.isGrounded) {
      const gravity = world.gravityDirection;
      const jumpForce = GAME_CONFIG.JUMP_FORCE;

      // Apply jump force opposite to gravity direction
      player.velocity.x -= gravity.x * jumpForce;
      player.velocity.y -= gravity.y * jumpForce;
      player.velocity.z -= gravity.z * jumpForce;

      player.isGrounded = false;
      player.hasUsedDoubleJump = false;
      return true;
    }
    return false;
  }

  doubleJump(player: Player, world: GameWorld): boolean {
    if (!player.isGrounded && player.canDoubleJump && !player.hasUsedDoubleJump) {
      const gravity = world.gravityDirection;
      const jumpForce = GAME_CONFIG.DOUBLE_JUMP_FORCE;

      // Reset vertical velocity and apply jump force
      if (gravity.y !== 0) player.velocity.y = -gravity.y * jumpForce;
      if (gravity.x !== 0) player.velocity.x = -gravity.x * jumpForce;
      if (gravity.z !== 0) player.velocity.z = -gravity.z * jumpForce;

      player.hasUsedDoubleJump = true;
      return true;
    }
    return false;
  }

  checkCollision(player: Player, world: GameWorld): void {
    const gravity = world.gravityDirection;
    const worldSize = GAME_CONFIG.WORLD_SIZE;
    
    // Check collision based on gravity direction
    if (gravity.y < 0) {
      // Normal gravity (down)
      if (player.position.y <= 0) {
        player.position.y = 0;
        player.velocity.y = Math.max(0, player.velocity.y);
        player.isGrounded = true;
      } else {
        player.isGrounded = false;
      }
    } else if (gravity.y > 0) {
      // Inverted gravity (up)
      if (player.position.y >= worldSize) {
        player.position.y = worldSize;
        player.velocity.y = Math.min(0, player.velocity.y);
        player.isGrounded = true;
      } else {
        player.isGrounded = false;
      }
    } else if (gravity.x < 0) {
      // Left wall gravity
      if (player.position.x <= 0) {
        player.position.x = 0;
        player.velocity.x = Math.max(0, player.velocity.x);
        player.isGrounded = true;
      } else {
        player.isGrounded = false;
      }
    } else if (gravity.x > 0) {
      // Right wall gravity
      if (player.position.x >= worldSize) {
        player.position.x = worldSize;
        player.velocity.x = Math.min(0, player.velocity.x);
        player.isGrounded = true;
      } else {
        player.isGrounded = false;
      }
    }
  }
}