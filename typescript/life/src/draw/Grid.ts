import {Draw} from "@src/draw/Draw";

export class Grid extends Draw {

    draw() {
        const splitSize = 10;
        let wUnit = this.canvas.width / splitSize;
        let hUnit = this.canvas.height / splitSize;
        this.context.strokeStyle = '#c8c8c8';
        this.context.lineWidth = 0.5;
        for (let i = 0; i < splitSize; i++) {
            this.context.beginPath();
            this.context.moveTo(wUnit * i, 0);
            this.context.lineTo(wUnit * i, this.canvas.height);
            this.context.stroke();
        }
        for (let i = 0; i < splitSize; i++) {
            this.context.beginPath();
            this.context.moveTo(0, hUnit * i);
            this.context.lineTo(this.canvas.width, hUnit * i);
            this.context.stroke();
        }
    }
}
