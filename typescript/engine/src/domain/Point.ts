export class Point {

    constructor(public x: number = 0, public y: number = 0, public z: number = 0) {
    }

    public toString(): string{
        return "[" + this.x + ", " + this.y + ", " + this.z + "]";
    }
}
