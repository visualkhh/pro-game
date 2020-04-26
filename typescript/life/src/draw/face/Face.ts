import {Draw} from "@src/draw/Draw";
import {essenceManager} from "@src/manager/Managers";
import {Type} from "@src/code/Type";
import {Point} from "@src/domain/Point";

export class Face extends Draw {

    draw() {
        // let rlvalue = essenceManager.positiveValue(Type.RIGHT_LEFT);
        // let udvalue = essenceManager.positiveValue(Type.UP_DOWN);
        // let lvalue = essenceManager.positiveValue(Type.DISCONTINUOUS_SERIES);
        let large = essenceManager.value(Type.LARGE);
        let pull = essenceManager.value(Type.PULL);
        let male = essenceManager.value(Type.MALE);
        // rlvalue = rlvalue * (slvalue / 50);
        // udvalue = udvalue * (slvalue / 50);
        // this.context.beginPath();
        // this.context.setLineDash([lvalue, lvalue]);
        // this.context.ellipse(this.canvas.width / 2, this.canvas.height / 2, rlvalue, udvalue, 2 * Math.PI, 0, 2 * Math.PI);
        // this.context.stroke();


        // setting
        const dotWidth = 5;
        const points = new Array<Point>();
        const halfWidth = this.canvas.width / 2;
        const halfHeight = this.canvas.height / 2;

        // center dot
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // centerWidth
        let centerWidthValue = (large + pull + male) / 3;
        let centerWidth = (halfWidth * centerWidthValue) / 100;
        centerWidth = Math.max(halfWidth * 0.5, Math.min(halfWidth, centerWidth));
        points.push(new Point(centerX - centerWidth, centerY));
        points.push(new Point(centerX + centerWidth, centerY));

        // downHeight
        let centerHeighValue = (large + pull + male) / 3;
        let centerHeight = (halfHeight * centerHeighValue) / 100;
        centerHeight = Math.max(halfHeight * 0.5, Math.min(halfHeight, centerHeight));
        let downHeight = centerY + centerHeight;
        points.push(new Point(centerX, downHeight));

        centerHeighValue = (large + pull) / 2;
        centerHeight = (halfHeight * centerHeighValue) / 100;
        centerHeight = Math.max(halfHeight * 0.5, Math.min(halfHeight, centerHeight));
        let upHeight = centerY - centerHeight;
        points.push(new Point(centerX, upHeight));


        centerWidthValue = (pull + male) / 3;
        centerWidth = (halfWidth * centerWidthValue) / 100;
        centerWidth = Math.max(halfWidth * 0.5, Math.min(halfWidth, centerWidth));
        points.push(new Point(centerX - centerWidth, (upHeight + (upHeight * 0.3))));
        points.push(new Point(centerX + centerWidth, (upHeight + (upHeight * 0.3))));

        centerWidthValue = (pull + male) / 3;
        centerWidth = (halfWidth * centerWidthValue) / 100;
        centerWidth = Math.max(halfWidth * 0.5, Math.min(halfWidth, centerWidth));
        points.push(new Point(centerX - centerWidth, (downHeight - (downHeight * 0.2))));
        points.push(new Point(centerX + centerWidth, (downHeight - (downHeight * 0.2))));


        this.context.beginPath();
        // this.context.moveTo(centerX, centerY);
        this.context.lineTo(points[7].x, points[7].y);
        this.context.lineTo(points[1].x, points[1].y);
        this.context.lineTo(points[5].x, points[5].y);
        this.context.lineTo(points[3].x, points[3].y);
        this.context.lineTo(points[4].x, points[4].y);
        this.context.lineTo(points[0].x, points[0].y);
        this.context.lineTo(points[6].x, points[6].y);
        this.context.lineTo(points[2].x, points[2].y);
        // this.context.lineTo(points[9].x, points[9].y);
        // points.forEach(it => {
        //
        // });
        this.context.closePath();
        this.context.stroke();

        // for (let i = 0; i < points.length; i++) {
        //     const it = points[i];
        //     this.context.beginPath();
        //     this.context.arc(it.x, it.y, dotWidth, 0, 2 * Math.PI);
        //     // this.context.fill();
        //     // this.context.beginPath();
        //     this.context.font = "20px Comic Sans MS";
        //     this.context.fillStyle = "red";
        //     this.context.textAlign = "center";
        //     this.context.fillText(""+i, it.x, it.y);
        //     this.context.fill();
        //     // this.context.fill();
        // }

        // path

    }
}
