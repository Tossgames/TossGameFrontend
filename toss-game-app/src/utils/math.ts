import { Vector3 } from '../types';

export const MathUtils = {
  // Vector3 operations
  vector3: {
    add(a: Vector3, b: Vector3): Vector3 {
      return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
    },

    subtract(a: Vector3, b: Vector3): Vector3 {
      return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
    },

    multiply(v: Vector3, scalar: number): Vector3 {
      return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
    },

    length(v: Vector3): number {
      return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    },

    normalize(v: Vector3): Vector3 {
      const len = this.length(v);
      if (len === 0) return { x: 0, y: 0, z: 0 };
      return { x: v.x / len, y: v.y / len, z: v.z / len };
    },

    zero(): Vector3 {
      return { x: 0, y: 0, z: 0 };
    }
  },

  // Rotation matrices for 90-degree rotations
  rotation: {
    rotateY90(point: Vector3): Vector3 {
      return { x: -point.z, y: point.y, z: point.x };
    },

    rotateYNeg90(point: Vector3): Vector3 {
      return { x: point.z, y: point.y, z: -point.x };
    },

    rotateZ90(point: Vector3): Vector3 {
      return { x: -point.y, y: point.x, z: point.z };
    },

    rotateZNeg90(point: Vector3): Vector3 {
      return { x: point.y, y: -point.x, z: point.z };
    }
  },

  // Utility functions
  clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  },

  lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  },

  degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  },

  radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }
};