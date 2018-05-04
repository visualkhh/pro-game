import { Observable } from 'rxjs/Observable';
import { Point } from 'app/com/khh/graphics/Point';
import { Obj } from 'app/com/khh/obj/Obj';
import {ObjImg} from 'app/com/khh/graphics/ObjImg';
import {Rect} from 'app/com/khh/graphics/Rect';
// import { Point } from '../org/Point';
// import * as abc from 'assert/js/processing.js';
export class Drone extends ObjImg{

  onDraw(): void {

    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    let ctxBuffer: CanvasRenderingContext2D = this.canvas.getContext("2d");
    ctxBuffer.drawImage(this.img,x - this.img.width/2, y -  this.img.height/2);



    /*
    무게(weight) 와 질량(mass)
물체의 질량은 물체에 포함되어 있는 물질의 양입니다. (킬로그램 단위로 측정합니다.)
질량과 혼동되는 무게는 사실 물체에 작용하는 중력의 힘을 말합니다. 뉴턴의 제 2 법칙에 따라 질량 곱하기 중력 가속도 (w = m * g)를 통해 무게를 계산할 수 있습니다. 무게는 뉴턴 단위로 측정합니다.
     */




  }

  clockSignal(value?: any) {
    this.onDraw();
  }

}
