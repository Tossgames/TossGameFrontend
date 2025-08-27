import { TouchInput } from '../../types';
import { GAME_CONFIG } from '../../constants';

export class TouchManager {
  private touchInput: TouchInput = {
    isTouching: false,
    touchCount: 0,
    lastTouchTime: 0,
  };

  private onJumpCallback?: () => void;
  private onDoubleJumpCallback?: () => void;
  private singleTapTimer?: NodeJS.Timeout;

  onJump(callback: () => void) {
    this.onJumpCallback = callback;
  }

  onDoubleJump(callback: () => void) {
    this.onDoubleJumpCallback = callback;
  }

  handleTouchStart = () => {
    const currentTime = Date.now();
    const timeSinceLastTouch = currentTime - this.touchInput.lastTouchTime;

    this.touchInput.isTouching = true;
    
    if (timeSinceLastTouch < GAME_CONFIG.DOUBLE_TAP_THRESHOLD) {
      // Double tap detected - clear single tap timer and execute double jump
      if (this.singleTapTimer) {
        clearTimeout(this.singleTapTimer);
        this.singleTapTimer = undefined;
      }
      this.onDoubleJumpCallback?.();
      this.touchInput.touchCount = 0;
    } else {
      // Potential single tap - wait for double tap timeout
      this.touchInput.touchCount = 1;
      this.singleTapTimer = setTimeout(() => {
        // No double tap occurred, execute single jump
        this.onJumpCallback?.();
        this.touchInput.touchCount = 0;
        this.singleTapTimer = undefined;
      }, GAME_CONFIG.DOUBLE_TAP_THRESHOLD);
    }

    this.touchInput.lastTouchTime = currentTime;
  };

  handleTouchEnd = () => {
    this.touchInput.isTouching = false;
  };

  getTouchInput(): TouchInput {
    return this.touchInput;
  }
}