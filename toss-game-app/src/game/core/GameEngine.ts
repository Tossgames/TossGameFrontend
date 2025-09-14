import { GameState, Player, GameWorld } from '../../types';
import { PhysicsEngine } from '../physics/PhysicsEngine';
import { GAME_CONFIG } from '../../constants';

export class GameEngine {
  private gameState: GameState = 'menu';
  private lastFrameTime = 0;
  private deltaTime = 0;
  private animationFrameId?: number;
  private physicsEngine: PhysicsEngine;
  private player?: Player;
  private gameWorld?: GameWorld;
  private onPlayerUpdate?: (player: Player) => void;

  constructor() {
    this.physicsEngine = new PhysicsEngine();
  }

  setPlayer(player: Player) {
    this.player = player;
  }

  setGameWorld(gameWorld: GameWorld) {
    this.gameWorld = gameWorld;
  }

  setOnPlayerUpdate(callback: (player: Player) => void) {
    this.onPlayerUpdate = callback;
  }

  start() {
    this.gameState = 'playing';
    this.lastFrameTime = performance.now();
    this.gameLoop();
  }

  pause() {
    this.gameState = 'paused';
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  resume() {
    if (this.gameState === 'paused') {
      this.gameState = 'playing';
      this.lastFrameTime = performance.now();
      this.gameLoop();
    }
  }

  stop() {
    this.gameState = 'gameOver';
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private gameLoop = () => {
    const currentTime = performance.now();
    this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;

    this.update(this.deltaTime);
    this.render();

    if (this.gameState === 'playing') {
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }
  };

  private update(deltaTime: number) {
    if (!this.player || !this.gameWorld) return;

    // 물리 계산
    this.physicsEngine.applyGravity(this.player, this.gameWorld, deltaTime);
    this.physicsEngine.updatePosition(this.player, deltaTime);
    this.physicsEngine.checkGroundCollision(this.player, this.gameWorld);

    // 플레이어 상태 업데이트를 React 컴포넌트에 알림
    this.onPlayerUpdate?.(this.player);
  }

  gravitySwitch() {
    if (this.player && this.player.isGrounded && this.gameWorld) {
      // 1. 플레이어의 위/아래 상태를 전환
      this.player.isOnTop = !this.player.isOnTop;

      // 2. 상태에 따라 중력 방향을 설정
      this.gameWorld.gravityDirection.y = this.player.isOnTop ? 1 : -1;

      // 3. 상태에 따라 플레이어 위치를 반대편으로 즉시 이동
      const playerSize = GAME_CONFIG.PLAYER_SIZE;
      if (this.player.isOnTop) {
        this.player.position.y = this.gameWorld.centerLineY - playerSize;
      } else {
        this.player.position.y = this.gameWorld.centerLineY;
      }

      // 4. 이동 후 속도 초기화
      this.player.velocity.y = 0;
    }
  }

  private render() {
    // TODO: Render game
  }

  getGameState(): GameState {
    return this.gameState;
  }

  getDeltaTime(): number {
    return this.deltaTime;
  }
}