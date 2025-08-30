import { TouchInput } from '../../types';
import { GAME_CONFIG } from '../../constants';

export class TouchManager {
  private touchInput: TouchInput = {
    isTouching: false,
    touchCount: 0,
    lastTouchTime: 0,
  };

  private onJumpCallback?: () => void;

  onJump(callback: () => void) {
    this.onJumpCallback = callback;
  }

  handleTouchStart = () => {
    this.touchInput.isTouching = true;
    // Fire jump immediately for better responsiveness
    // Game logic will decide jump type based on player state
    this.onJumpCallback?.();
  };

  handleTouchEnd = () => {
    this.touchInput.isTouching = false;
  };

  getTouchInput(): TouchInput {
    return this.touchInput;
  }
}