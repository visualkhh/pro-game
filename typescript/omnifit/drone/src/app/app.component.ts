import {Component, HostListener, OnInit, ElementRef, Renderer2, ViewChild, AfterViewInit} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
// Observable operators
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

///////https://medium.com/@tarik.nzl/creating-a-canvas-component-with-free-hand-drawing-with-rxjs-and-angular-61279f577415
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  title = 'app';
  private innerWidth: number;
  private innerHeight: number;
  private context: CanvasRenderingContext2D | null;

  @ViewChild('canvas') public canvas: ElementRef;

  constructor(private hostElement: ElementRef, private renderer: Renderer2) {
    // console.log(this.hostElement.nativeElement.outerHTML);
  }


  // private canvas: HTMLCanvasElement | null;

  // ngOnInit(): void {
  //   this.innerWidth = window.innerWidth;
  //   this.innerHeight = window.innerHeight;
  //   this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
  //   this.context = this.canvas.getContext('2d');
  //   this.onDraw();
  // }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.onDraw();
  }

  onDraw() {
    console.log('---', this.canvas, this.context);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    this.context.font = '30pt Calibri';
    this.context.textAlign = 'center';
    this.context.fillStyle = 'blue';
    this.context.fillText('Hello World!', x, y);
  }

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.context = canvasEl.getContext('2d');

    canvasEl.width = this.innerWidth;
    canvasEl.height = this.innerHeight;

    this.context.lineWidth = 3;
    this.context.lineCap = 'round';
    this.context.strokeStyle = '#000';
  }




}
