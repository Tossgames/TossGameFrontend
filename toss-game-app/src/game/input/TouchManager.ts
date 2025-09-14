import { TouchInput } from '../../types';

export class TouchManager {
  private touchInput: TouchInput = {
    isTouching: false,
    touchCount: 0,
    lastTouchTime: 0,
    doubleTapWindow: 300, // 300ms 내에 더블탭 감지
  };

  private onJumpCallback?: () => void;
  private onDoubleJumpCallback?: () => void;
  private onGravityToggleCallback?: () => void;

  onJump(callback: () => void) {
    this.onJumpCallback = callback;
  }

  onDoubleJump(callback: () => void) {
    this.onDoubleJumpCallback = callback;
  }

  onGravityToggle(callback: () => void) {
    this.onGravityToggleCallback = callback;
  }

  handleTouchStart = () => {
    const currentTime = Date.now();
    const timeSinceLastTouch = currentTime - this.touchInput.lastTouchTime;

    this.touchInput.isTouching = true;
    this.touchInput.touchCount++;

    // 더블탭 감지
    if (timeSinceLastTouch < this.touchInput.doubleTapWindow) {
      this.onDoubleJumpCallback?.();
    } else {
      // 첫 번째 탭 - 일반 점프
      this.onJumpCallback?.();
    }

    this.touchInput.lastTouchTime = currentTime;
  };

  handleTouchEnd = () => {
    this.touchInput.isTouching = false;
  };

  // 중력 전환 버튼용 (UI 버튼)
  handleGravityToggle = () => {
    this.onGravityToggleCallback?.();
  };

  getTouchInput(): TouchInput {
    return this.touchInput;
  }
}