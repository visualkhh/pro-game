export abstract class Draw {

    public fillStyle = '#000000';
    public strokeStyle = '#000000';

    constructor(public canvas: HTMLCanvasElement, public context: CanvasRenderingContext2D) {
    }

    abstract draw(): void;
}
