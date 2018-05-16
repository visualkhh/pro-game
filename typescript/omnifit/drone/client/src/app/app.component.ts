// import * as Processing from 'assets/javascript/processing-1.4.1';
import {AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
// Observable operators
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import {hello} from 'assets/javascript/omnifit';
import {DroneStageManager} from './com/khh/omnifit/game/drone/DroneStageManager';
import {DroneStageEnd} from './com/khh/omnifit/game/drone/stage/DroneStageEnd';
import {DroneStageIntro} from './com/khh/omnifit/game/drone/stage/DroneStageIntro';
import {DroneStageGame} from './com/khh/omnifit/game/drone/stage/DroneStageGame';
import {Drone} from './com/khh/omnifit/game/drone/obj/drone/Drone';
import {Ground} from './com/khh/omnifit/game/drone/obj/ground/Ground';
import {Wind} from './com/khh/omnifit/game/drone/obj/wind/Wind';
import {Cloud} from './com/khh/omnifit/game/drone/obj/cloud/Cloud';
import {Score} from './com/khh/omnifit/game/drone/obj/score/Score';
import {ReadyButton} from './com/khh/omnifit/game/drone/obj/button/ReadyButton';
import {DroneResourceManager} from './com/khh/omnifit/game/drone/DroneResourceManager';


// https://medium.com/@tarik.nzl/creating-a-canvas-component-with-free-hand-drawing-with-rxjs-and-angular-61279f577415
// typescript observable subscribe example
// https://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/creating_and_subscribing_to_simple_observable_sequences.html
// https://wonism.github.io/rxjs-5/
// https://angular-2-training-book.rangle.io/handout/observables/using_observables.html
// https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/creating.md
// https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators
// http://reactivex.io/
declare var Processing: any;   // not required
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  private title = 'app';

  private canvas: HTMLCanvasElement;
  private manager: DroneStageManager;
  private context: CanvasRenderingContext2D | null;
  @ViewChild('canvas') public canvasElementRef: ElementRef;
  private resourceManager: DroneResourceManager;
  constructor(private hostElement: ElementRef, private renderer: Renderer2) {
  }


  ngOnInit(): void {
    this.canvas = this.canvasElementRef.nativeElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext('2d');


  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    //trigger
    this.canvas.dispatchEvent(new Event('resize'));
  }

  ngAfterViewInit(): void {
    //game initialize
    this.manager = DroneStageManager.getInstance();
    this.resourceManager = DroneResourceManager.getInstance();

    //stage Intro
    const droneStageIntro = new DroneStageIntro(this.canvas);

    //Stage Game
    const droneStageGame = new DroneStageGame(this.canvas);

    // const droneImg = new Image(); droneImg.src = 'assets/image/drone.png';
    // const drone = new Drone(droneStageGame, 0, 0, 20, droneImg);

    const cloudImg = this.resourceManager.resources.get('cloudImg');
    const cloud = new Cloud(droneStageGame, 0, 0, 10, cloudImg);

    const groundImg = this.resourceManager.resources.get('groundImg');
    const ground = new Ground(droneStageGame, 0, 0, 5, groundImg);

    const readyGreenImg = this.resourceManager.resources.get('readyGreenImg');
    const readyBlueImg = this.resourceManager.resources.get('readyBlueImg');
    const readyYellowImg = this.resourceManager.resources.get('readyYellowImg');
    const readyBtn = new ReadyButton(droneStageGame, 0, 0, 400, readyGreenImg, readyYellowImg);

    const score = new Score(droneStageGame, 0, 0, 500);
    const wind = new Wind(droneStageGame, 0, 0, 500);
    droneStageGame.objPush([cloud, wind, score, ground, readyBtn]);

    //Stage End
    const droneStageEnd = new DroneStageEnd(this.canvas);

    // this.manager.onCreate(this.canvas, [droneStageIntro, droneStageGame, droneStageEnd]);
    this.manager.pushStage(droneStageIntro);
    this.manager.pushStage(droneStageGame);
    this.manager.pushStage(droneStageEnd);
    this.manager.onCreate(this.canvas);
    this.manager.onStart();

    //customEvent
    // Observable.fromEvent(this.canvas, 'load').subscribe((event) => {
    //   console.log('load');
    // });
    // Observable.fromEvent(this.canvas, 'mousedown').subscribe((event: MouseEvent)=>{
    //   if(this.manager)this.manager.mousedown(event);
    // });
    //
    // Observable.fromEvent(this.canvas, 'mouseup').subscribe((event: MouseEvent)=>{
    //   if(this.manager)this.manager.mouseup(event);
    // });
    // Observable.fromEvent(this.canvas, 'mousemove').subscribe((event: MouseEvent)=>{
    //   if(this.manager)this.manager.mousemove(event);
    // });
    // Observable.fromEvent(this.canvas, 'keydown').subscribe((event: KeyboardEvent)=>{
    //   if(this.manager)this.manager.keydown(event);
    // });
    // Observable.fromEvent(this.canvas, 'keyup').subscribe((event: KeyboardEvent)=>{
    //   if(this.manager)this.manager.keyup(event);
    // });
    //
    // Observable.fromEvent(this.canvas, 'resize').subscribe((event: Event)=>{
    //   console.log("rrrrrrrrrrrrrrrrrsssssssssssssssssszzzzzz")
    //   // if(this.manager)this.manager.eventSignal(event);
    // });
    // //customEvent
    // Observable.fromEvent(window, 'omnifit-concentration').subscribe((event: CustomEvent)=>{
    //   let intent = new Intent<number>();
    //   intent.name = event.detail.name;
    //   intent.data = event.detail.data;
    //   this.manager.intentSignal(intent);
    // });

    //Observable
    //// this will capture all mousedown events from teh canvas element
    //  .fromEvent(this.canvas, 'mousedown')
    //  .switchMap((e) => {
    //    return Observable
    //    // after a mouse down, we'll record all mouse moves
    //      .fromEvent(this.canvas, 'mousemove')
    //      // we'll stop (and unsubscribe) once the user releases the mouse
    //      // this will trigger a 'mouseup' event
    //      .takeUntil(Observable.fromEvent(this.canvas, 'mouseup'))
    //      // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
    //      .takeUntil(Observable.fromEvent(this.canvas, 'mouseleave'))
    //      // pairwise lets us get the previous value to draw a line from
    //      // the previous point to the current point
    //      .pairwise()
    //  })
    //  .subscribe((res: [MouseEvent, MouseEvent]) => {
    //    const rect = this.canvas.getBoundingClientRect();

    //    // previous and current position with the offset
    //    const prevPos = {
    //      x: res[0].clientX - rect.left,
    //      y: res[0].clientY - rect.top
    //    };

    //    const currentPos = {
    //      x: res[1].clientX - rect.left,
    //      y: res[1].clientY - rect.top
    //    };

    //    // this method we'll implement soon to do the actual drawing
    //    this.drawOnCanvas(prevPos, currentPos);
    //  });
  }
  // addReSizeSubscribe(next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription{
  //   // return Observable.fromEvent(window, 'resize').subscribe(e => console.log(e));
  //   return Observable.fromEvent(window, 'resize').subscribe(next);
  // }

}
