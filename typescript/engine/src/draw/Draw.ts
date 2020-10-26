export abstract class Draw {

    constructor(public canvas: HTMLCanvasElement, public context: CanvasRenderingContext2D) {
    }

    abstract draw(): void;
}
