// import * as Processing from 'assets/javascript/processing-1.4.1';
import {AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
// Observable operators
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import {Manager} from './com/khh/omnifit/game/drone/Manager';
import {Clock} from './com/khh/clock/Clock';
import {hello} from 'assets/javascript/omnifit';
import {Intent} from './com/khh/data/Intent';
import {RandomUtil} from './com/khh/math/RandomUtil';


// https://medium.com/@tarik.nzl/creating-a-canvas-component-with-free-hand-drawing-with-rxjs-and-angular-61279f577415

// typescript observable subscribe example
// https://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/creating_and_subscribing_to_simple_observable_sequences.html
//https://wonism.github.io/rxjs-5/
//https://angular-2-training-book.rangle.io/handout/observables/using_observables.html
//https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/creating.md
//https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators
//http://reactivex.io/
declare var Processing :any;   // not required
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  private title = 'app';

  private canvas: HTMLCanvasElement;
  private manager: Manager;
  private context: CanvasRenderingContext2D | null;
  @ViewChild('canvas') public canvasElementRef: ElementRef;
  @ViewChild('con') public conElementRef: ElementRef;

  constructor(private hostElement: ElementRef, private renderer: Renderer2) {
    // console.log(this.hostElement.nativeElement.outerHTML);
    // this.addReSizeSubscribe(this.manager.resize);
  }


  // private canvasElementRef: HTMLCanvasElement | null;

  ngOnInit(): void {
    // this.canvasElementRef = document.getElementById('canvasElementRef') as HTMLCanvasElement;
    this.canvas = this.canvasElementRef.nativeElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext('2d');
    this.manager = new Manager(this.canvas);
    //hello(1);


    let conClock = new Clock(2000);
    conClock.subscribe((it)=>{
      let intent = new Intent<number>();
      if(this.conElementRef.nativeElement.value){
        intent.name="original"
        intent.data = this.conElementRef.nativeElement.value as number;
      }else{
        intent.name="dummy"
        intent.data = Math.floor(RandomUtil.random(0,10));
      }
      // console.log("con:"+val)
      this.manager.intentSignal(intent);
    });

    // let signalClock = new Clock(2000);
    // signalClock.subscribe(it=>{
    //   console.log(it);
    //   var window = window;
    //   window.con = Math.random() * (10 - 0) + 0
    // });

    this.onDraw();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    //trigger
    this.canvas.dispatchEvent(new Event('resize'));
    this.onDraw();
  }

  onDraw() {
    // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // const x = this.canvas.width / 2;
    // const y = this.canvas.height / 2;
    // this.context.font = '30pt Calibri';
    // this.context.textAlign = 'center';
    // this.context.fillStyle = 'blue';
    // this.context.fillText('Hello World!', x, y);

    // //draw image
    // const drawing = new Image() as HTMLImageElement;
    // drawing.src = "assets/img/drone.png"; // can also be a remote URL e.g. http://
    // drawing.onload = (ev)=>{
    //   this.context.drawImage(drawing,x - drawing.width/2, y -  drawing.height/2);
    // }
    // console.log(new (new Processing).Random(1).nextGaussian())
    // console.log(new Processing().random(100,200))
    if(this.manager)this.manager.draw();
  }

  ngAfterViewInit(): void {
    Observable.fromEvent(this.canvas, 'mousedown').subscribe((event: MouseEvent)=>{
      if(this.manager)this.manager.mousedown(event);
    });

    Observable.fromEvent(this.canvas, 'mouseup').subscribe((event: MouseEvent)=>{
      if(this.manager)this.manager.mouseup(event);
    });
    Observable.fromEvent(this.canvas, 'mousemove').subscribe((event: MouseEvent)=>{
      if(this.manager)this.manager.mousemove(event);
    });
    Observable.fromEvent(this.canvas, 'keydown').subscribe((event: KeyboardEvent)=>{
      if(this.manager)this.manager.keydown(event);
    });
    Observable.fromEvent(this.canvas, 'keyup').subscribe((event: KeyboardEvent)=>{
      if(this.manager)this.manager.keyup(event);
    });

    Observable.fromEvent(this.canvas, 'resize').subscribe((event: Event)=>{
      if(this.manager)this.manager.eventSignal(event);
    });



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
