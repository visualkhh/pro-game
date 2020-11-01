import {Draw} from "@src/draw/Draw";

export interface Drawable {
    draw(draw: Draw): void;
}
