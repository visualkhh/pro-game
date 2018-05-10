import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../../../../../lib-typescript/com/khh/data/Intent';
import {PointVector} from '../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../../../../../../../../../lib-typescript/com/khh/math/RandomUtil';
import {GameData} from '../../vo/GameData';
import {DroneStage} from '../../stage/DroneStage';

//뉴턴 운동법칙
export class TestDummy extends ObjDrone {


  intentSignal(intent: Intent<GameData>) {

  }



  onDraw(): void {
    let context = this.canvas.getContext("2d");
    context.beginPath();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.arc(RandomUtil.random(0,this.canvas.width), RandomUtil.random(0,this.canvas.height),RandomUtil.random(0,40),0,Math.PI*2);
    context.fill();
    context.save();
  }



  constructor(stage: DroneStage, x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(stage, x, y, z, canvas);
    this.onStart();
  }





}
