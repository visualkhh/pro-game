import {Draw} from "@src/draw/Draw";

export class SizeGrid extends Draw {

    draw() {
        const splitSize = 100;
        let wUnit = splitSize;
        let hUnit = splitSize;
        this.context.strokeStyle = '#373737';
        this.context.lineWidth = 0.5;
        this.context.setLineDash([4, 2]);
        for (let i = 0; wUnit * i < this.canvas.width; i++) {
            this.context.beginPath();
            this.context.moveTo(wUnit * i, 0);
            this.context.lineTo(wUnit * i, this.canvas.height);
            this.context.stroke();
        }
        for (let i = 0; hUnit * i < this.canvas.height; i++) {
            this.context.beginPath();
            this.context.moveTo(0, hUnit * i);
            this.context.lineTo(this.canvas.width, hUnit * i);
            this.context.stroke();
        }
    }
}
