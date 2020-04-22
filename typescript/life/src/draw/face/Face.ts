import {Draw} from "@src/draw/Draw";
import {essenceManager} from "@src/manager/Managers";
import {Type} from "@src/code/Type";

export class Face extends Draw {

    draw() {
        let rlvalue = essenceManager.positiveValue(Type.RIGHT_LEFT);
        let udvalue = essenceManager.positiveValue(Type.UP_DOWN);
        let lvalue = essenceManager.positiveValue(Type.DISCONTINUOUS_SERIES);
        let slvalue = essenceManager.positiveValue(Type.SMALL_LARGE);
        rlvalue = rlvalue * (slvalue / 50);
        udvalue = udvalue * (slvalue / 50);
        this.context.beginPath();
        this.context.setLineDash([lvalue, lvalue]);
        this.context.ellipse(this.canvas.width / 2, this.canvas.height / 2, rlvalue, udvalue, 2 * Math.PI, 0, 2 * Math.PI);
        this.context.stroke();

    }
}
