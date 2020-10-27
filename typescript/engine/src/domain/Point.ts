import {Unit} from "@src/domain/Unit";

export class Point {
    // public unit: Unit | undefined;
    constructor(public x: number = 0, public y: number = 0, public z: number = 0) {
    }
    public toString(): string{
        return "[" + this.x + ", " + this.y + ", " + this.z + "]";
    }
}
