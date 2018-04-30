import {Component, HostListener, OnInit, ElementRef, Renderer2, ViewChild, AfterViewInit} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
// Observable operators
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

// https://medium.com/@tarik.nzl/creating-a-canvas-component-with-free-hand-drawing-with-rxjs-and-angular-61279f577415

// typescript observable subscribe example
// https://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/creating_and_subscribing_to_simple_observable_sequences.html
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
  private context: CanvasRenderingContext2D | null;
  @ViewChild('canvas') public canvasElementRef: ElementRef;

  constructor(private hostElement: ElementRef, private renderer: Renderer2) {
    // console.log(this.hostElement.nativeElement.outerHTML);
  }


  // private canvasElementRef: HTMLCanvasElement | null;

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    // this.canvasElementRef = document.getElementById('canvasElementRef') as HTMLCanvasElement;
    this.canvas = this.canvasElementRef.nativeElement;
    this.context = this.canvas.getContext('2d');
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








    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    this.context.font = '30pt Calibri';
    this.context.textAlign = 'center';
    this.context.fillStyle = 'blue';
    this.context.fillText('Hello World!', x, y);

    //draw image
    const drawing = new Image() as HTMLImageElement;
    drawing.src = "assets/img/drone.png"; // can also be a remote URL e.g. http://
    drawing.onload = (ev)=>{
      this.context.drawImage(drawing,x - drawing.width/2, y -  drawing.height/2);
    }



  }











  ngAfterViewInit(): void {
    // const canvasEl: HTMLCanvasElement = this.canvasElementRef.nativeElement;
    // this.context = canvasEl.getContext('2d');
    //
    // canvasEl.width = this.innerWidth;
    // canvasEl.height = this.innerHeight;
    //
    // this.context.lineWidth = 3;
    // this.context.lineCap = 'round';
    // this.context.strokeStyle = '#000';
  }




}
