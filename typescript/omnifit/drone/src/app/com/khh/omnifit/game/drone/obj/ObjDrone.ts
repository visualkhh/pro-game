import {IntentSignal} from '../../../../data/IntentSignal';
import {Intent} from '../../../../data/Intent';
import {ObjImg} from '../../../../graphics/ObjImg';
import {GameData} from '../vo/GameData';
import {Point} from '../../../../graphics/Point';
import {DroneStage} from '../stage/DroneStage';

export abstract class ObjDrone extends ObjImg implements LifeCycle, IntentSignal<GameData>, MouseSignal, KeyboardSignal{

  abstract intentSignal(intent: Intent<GameData>);

  private _stage: DroneStage;

  get stage(): DroneStage {
    return this._stage;
  }

  constructor(stage: DroneStage, x: number = 0, y: number = 0, z: number = 0, canvas: HTMLCanvasElement, img?: HTMLImageElement, head?: Point) {
    super(x, y, z, canvas, img, head);
    this._stage = stage;
  }

  onCreate(data?: any) {
  }

  onStart(data?: any) {
    // const context: CanvasRenderingContext2D = this.canvas.getContext('2d');
    // context.setTransform(1, 0, 0, 1, 0, 0);
    // context.fillStyle = "#000000";
    // context.strokeStyle = "#000000";
    // context.save();
  }

  onResume(data?: any) {
  }

  onRestart(data?: any) {
    this.onStart(data);
  }

  onPause(data?: any) {
  }

  onStop(data?: any) {
  }

  onDestroy(data?: any) {
  }

  // checkEdges = function() {
  //   if (this.position.x > width) {
  //     this.position.x = 0;
  //   }
  //   else if (this.position.x < 0) {
  //     this.position.x = width;
  //   }
  //
  //   if (this.position.y > height) {
  //     this.position.y = 0;
  //   }
  //   else if (this.position.y < 0) {
  //     this.position.y = height;
  //   }
  // };


  keydown(event: KeyboardEvent): void {
  }

  keyup(event: KeyboardEvent): void {
  }

  mousedown(event: MouseEvent): void {
  }

  mousemove(event: MouseEvent): void {
  }

  mouseup(event: MouseEvent): void {
  }


}
