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
    }else {
      this.x = v;
      this.y = y;
      this.z = z
    }
  }


  public get() {
    return new PointVector(this.x, this.y, this.z)
  }

  //피타고라스의 정리는 a의 제곱 더하기 b 의 제곱은 c 의 제곱과 같다는 것을 정의합니다.
  public mag(): number {
    var x = this.x,
      y = this.y,
      z = this.z;
    return Math.sqrt(x * x + y * y + z * z) //의 제곱근을 리턴하면 길이가 반환된다.
  }
  public add(v: number|PointVector, y: number = 0, z: number = 0) {
    if (v instanceof PointVector) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z
    }else {
      this.x += v;
      this.y += y;
      this.z += z;
    }
  }
  public static add(v1: PointVector, v2: PointVector): PointVector {
    return new PointVector(v1.x+v2.x, v1.y+v2.y, v1.x+v2.y);
  }

  public sub(v: number|PointVector, y: number, z: number) {
    if (v instanceof PointVector) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z
    }else {
      this.x -= y;
      this.y -= y;
      this.z -= z
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
      this.z *= v
    }
  }

  public div(v: number|PointVector) {
    if (v instanceof PointVector) {
      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;
    } else {
      this.x /= v;
      this.y /= v;
      this.z /= v
    }
  }
  public static div(v: PointVector, d: number): PointVector {
    let rv = v.get();
      rv.x /= d;
      rv.y /= d;
      rv.z /= d;
      return rv;
  }
  public dist(v): number {
    var dx = this.x - v.x,
      dy = this.y - v.y,
      dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  public dot(v, y, z): number {
    if (arguments.length === 1) return this.x * v.x + this.y * v.y + this.z * v.z;
    return this.x * v + this.y * y + this.z * z
  }

  public cross(v): PointVector {
    var x = this.x,
      y = this.y,
      z = this.z;
    return new PointVector(y * v.z - v.y * z, z * v.x - v.z * x, x * v.y - v.x * y)
  }

  public normalize() {
    var m = this.mag();
    if (m > 0) this.div(m);
  }

  public limit(high) {
    if (this.mag() > high) {
      this.normalize();
      this.mult(high);
    }
  }

  public heading2D() {
    return -Math.atan2(-this.y, this.x);
  }

  public toString(): string{
    return "[" + this.x + ", " + this.y + ", " + this.z + "]";
  }

  public array(): Array<number> {
    return [this.x, this.y, this.z];
  }




}
