import {Component, HostListener, OnInit, ElementRef, Renderer2, ViewChild, AfterViewInit} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
// Observable operators
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import {Observer} from 'rxjs/Observer';
import {Manager} from './com/khh/omnifit/game/drone/Manager';

// https://medium.com/@tarik.nzl/creating-a-canvas-component-with-free-hand-drawing-with-rxjs-and-angular-61279f577415

// typescript observable subscribe example
// https://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/creating_and_subscribing_to_simple_observable_sequences.html
//https://wonism.github.io/rxjs-5/
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  private title = 'app';
  private innerWidth: number;
  private innerHeight: number;

  private canvas: HTMLCanvasElement;
  private manager: Manager;
  private context: CanvasRenderingContext2D | null;
  @ViewChild('canvas') public canvasElementRef: ElementRef;

  constructor(private hostElement: ElementRef, private renderer: Renderer2) {
    // console.log(this.hostElement.nativeElement.outerHTML);
    // this.addReSizeSubscribe(this.manager.resize);
  }


  // private canvasElementRef: HTMLCanvasElement | null;

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    // this.canvasElementRef = document.getElementById('canvasElementRef') as HTMLCanvasElement;
    this.canvas = this.canvasElementRef.nativeElement;
    this.context = this.canvas.getContext('2d');
    this.manager = new Manager(this.canvas);
    this.onDraw();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.onDraw();
  }

  onDraw() {
    console.log('-----', this.canvas, this.context);
    this.canvas.width =  this.innerWidth;
    this.canvas.height = this.innerHeight;

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
    if(this.manager)
    this.manager.draw();
  }

  ngAfterViewInit(): void {
  }


  // addReSizeSubscribe(next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription{
  //   // return Observable.fromEvent(window, 'resize').subscribe(e => console.log(e));
  //   return Observable.fromEvent(window, 'resize').subscribe(next);
  // }

}
