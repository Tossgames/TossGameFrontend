import { GameWorld } from '../../types';
import { GRAVITY_DIRECTIONS, GAME_CONFIG } from '../../constants';

export class WorldRotationSystem {
  private isRotating = false;
  private rotationStartTime = 0;
  private onRotationCompleteCallback?: () => void;

  rotateWorld(world: GameWorld, direction: 'clockwise' | 'counterclockwise'): void {
    if (this.isRotating) return;

    this.isRotating = true;
    this.rotationStartTime = Date.now();

    const currentRotation = world.rotation;
    let newRotation: number;

    if (direction === 'clockwise') {
      newRotation = (currentRotation + 90) % 360;
    } else {
      newRotation = (currentRotation - 90 + 360) % 360;
    }

    // Animate rotation
    this.animateRotation(world, currentRotation, newRotation);
  }

  private animateRotation(world: GameWorld, fromRotation: number, toRotation: number): void {
    const startTime = this.rotationStartTime;
    const duration = GAME_CONFIG.ROTATION_DURATION;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-in-out)
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      world.rotation = fromRotation + (toRotation - fromRotation) * easeProgress;
      world.gravityDirection = GRAVITY_DIRECTIONS[toRotation as keyof typeof GRAVITY_DIRECTIONS];

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isRotating = false;
        this.onRotationCompleteCallback?.();
      }
    };

    requestAnimationFrame(animate);
  }

  onRotationComplete(callback: () => void): void {
    this.onRotationCompleteCallback = callback;
  }

  isCurrentlyRotating(): boolean {
    return this.isRotating;
  }

  triggerRotationAtSection(world: GameWorld, sectionNumber: number): void {
    // Define rotation patterns for each section
    const rotationPatterns = [
      'clockwise',    // Section 1
      'clockwise',    // Section 2  
      'counterclockwise', // Section 3
      'clockwise',    // Section 4
      // Add more patterns as needed
    ];

    const pattern = rotationPatterns[sectionNumber % rotationPatterns.length];
    this.rotateWorld(world, pattern as 'clockwise' | 'counterclockwise');
  }
}