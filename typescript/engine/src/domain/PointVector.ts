// https://p5js.org/ko/
export class PointVector {
  private _x: number;
  private _y: number;
  private _z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this._x = x;
    this._y = y;
    this._z = z;
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }

  get z(): number {
    return this._z;
  }

  set z(value: number) {
    this._z = value;
  }

  public set(v: number|PointVector, y: number = 0, z: number = 0) {
    if (v instanceof PointVector) {
      this.set(v.x || 0, v.y || 0, v.z || 0);
    } else {
      this.x = v;
      this.y = y;
      this.z = z;
    }
    return this;
  }

  public get() {
    return new PointVector(this.x, this.y, this.z);
  }

  // 피타고라스의 정리는 a의 제곱 더하기 b 의 제곱은 c 의 제곱과 같다는 것을 정의합니다.
  public mag(): number {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    return Math.sqrt(x * x + y * y + z * z); // 의 제곱근을 리턴하면 길이가 반환된다.
  }
  public add(v: number|PointVector, y: number = 0, z: number = 0) {
    if (v instanceof PointVector) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
    }else {
      this.x += v;
      this.y += y;
      this.z += z;
    }
  }
  public static add(v1: PointVector, v2: PointVector): PointVector {
    return new PointVector(v1.x + v2.x, v1.y + v2.y, v1.x + v2.y);
  }

  public sub(v: number|PointVector, y = 0, z = 0) {
    if (v instanceof PointVector) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
    }else {
      this.x -= v;
      this.y -= y;
      this.z -= z;
    }
  }
  public static sub(v1: PointVector, v2: PointVector): PointVector {
      return new PointVector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  public mult(v: number|PointVector) {
    if (v instanceof PointVector) {
      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
    } else {
      this.x *= v;
      this.y *= v;
      this.z *= v;
    }
    return this;
  }
  public static mult(v1: PointVector, v2: PointVector) {
    return new PointVector(v1.x *= v2.x, v1.y *= v2.y, v1.z *= v2.z);
  }

  public div(v: number|PointVector) {
    if (v instanceof PointVector) {
      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;
    } else {
      this.x /= v;
      this.y /= v;
      this.z /= v;
    }
  }
  public static div(v: PointVector, d: number): PointVector {
    const rv = v.get();
    rv.x /= d;
    rv.y /= d;
    rv.z /= d;
    return rv;
  }
  public dist(v: PointVector): number {
    const dx = this.x - v.x,
      dy = this.y - v.y,
      dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  public static dist(v1: PointVector, v2: PointVector): number {
    const dx = v1.x - v2.x,
      dy = v1.y - v2.y,
      dz = v1.z - v2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  public dot(v: number|PointVector, y: number, z: number): number {
      if (v instanceof PointVector) { return this.x * v.x + this.y * v.y + this.z * v.z; };
    return this.x * v + this.y * y + this.z * z;
  }

  public cross(v: PointVector): PointVector {
    const x = this.x,
      y = this.y,
      z = this.z;
    return new PointVector(y * v.z - v.y * z, z * v.x - v.z * x, x * v.y - v.x * y);
  }

  public normalize() {
    const m = this.mag();
    if (m > 0) this.div(m);
  }

  public limit(high: number) {
    if (this.mag() > high) {
      this.normalize();
      this.mult(high);
    }
  }

  public heading2D() {
    return -Math.atan2(-this.y, this.x);
  }

  public random2D() {
    return this.fromAngle(Math.random() * (2*Math.PI));
  }
  public fromAngle(angle: number, length = 1) {
    return new PointVector(length * Math.cos(angle), length * Math.sin(angle), 0);
  };
  public fromAngles(theta: number, phi: number, length = 1) {
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    return new PointVector(
        length * sinTheta * sinPhi,
        -length * cosTheta,
        length * sinTheta * cosPhi
    );
  };

  public array(): number[] {
    return [this.x, this.y, this.z];
  }

  public toString(): string{
    return "[" + this.x + ", " + this.y + ", " + this.z + "]";
  }

}
