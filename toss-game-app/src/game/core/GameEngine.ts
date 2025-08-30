import { GameState, Player, GameWorld } from '../../types';
import { PhysicsEngine } from '../physics/PhysicsEngine';

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

    // Apply physics
    this.physicsEngine.applyGravity(this.player, this.gameWorld, deltaTime);
    this.physicsEngine.updatePosition(this.player, deltaTime);
    this.physicsEngine.checkCollision(this.player, this.gameWorld);

    // Notify React component about player updates
    this.onPlayerUpdate?.(this.player);
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