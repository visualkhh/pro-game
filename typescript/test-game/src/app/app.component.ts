import {AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {interval} from 'rxjs-compat/observable/interval';
import {range} from 'rxjs-compat/observable/range';
import 'rxjs-compat/add/operator/delay';
import 'rxjs-compat/add/operator/take';
import {PointVector} from '../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../lib-typescript/com/khh/random/RandomUtil';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') public canvasElementRef: ElementRef;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.dispatchEvent(new Event('resize'));
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.canvas = this.canvasElementRef.nativeElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext('2d');

    this.run();

    // range(0, 10).delay(1000).subscribe(it => console.log(new Date().getMilliseconds(), it));
      // interval(1000)
      // // .map(x => x + 1) // to start from 1 instead of 0
      // // .map(x => console.log(x)) // do some logic here
      // // .take(60)
      // .subscribe((it) => {
      //   console.log(it);
      // });
  }
  run () {
    const ducktaek = new Image(10, 10);
    ducktaek.src = '/assets/ducktaek.png';
    const duckboon = new Image(10, 10);
    duckboon.src = '/assets/duckboon.png';
    const moon = new Image(10, 10);
    moon.src = '/assets/moon_PNG52.png';
    // duckboon.onload = (even) => {
    //   console.log('asd');
    //   // this.context.drawImage(ducktaek, 100, 100);
    // };

    // this.context.beginPath();
    // this.context.lineWidth = 1;
    // this.context.strokeStyle = 'blue';
    // this.context.rect(0, 0, 300, 300);
    // this.context.stroke();


    const start = new PointVector(RandomUtil.random(10, window.innerWidth), RandomUtil.random(10, window.innerHeight));
    const center = new PointVector(RandomUtil.random(10, window.innerWidth), RandomUtil.random(10, window.innerHeight));
    const end = new PointVector(RandomUtil.random(10, window.innerWidth), RandomUtil.random(10, window.innerHeight));
    const lastEnd = new PointVector(RandomUtil.random(10, window.innerWidth), RandomUtil.random(10, window.innerHeight));


    this.context.beginPath();
    this.context.arc(start.x, start.y, 10, 0, 2 * Math.PI);
    this.context.stroke();
    this.context.beginPath();
    this.context.arc(center.x, center.y, 10, 0, 2 * Math.PI);
    this.context.stroke();
    this.context.beginPath();
    this.context.arc(end.x, end.y, 10, 0, 2 * Math.PI);
    this.context.stroke();
    this.context.beginPath();
    this.context.arc(lastEnd.x, lastEnd.y, 10, 0, 2 * Math.PI);
    this.context.stroke();


    const frame = 500;
    const sD = new PointVector((start.x - center.x) / frame, (start.y - center.y) / frame);
    const cD = new PointVector((center.x - end.x) / frame, (center.y - end.y) / frame);
    const eD = new PointVector((end.x - lastEnd.x) / frame, (end.y - lastEnd.y) / frame);
    const leD = new PointVector(lastEnd.x / frame, lastEnd.y / frame);


    interval(10).take(frame).subscribe(it => {
      start.sub(sD);
      center.sub(cD);
      end.sub(eD);
      // this.context.beginPath();
      // this.context.arc(start.x, start.y, 5, 0, 2 * Math.PI);
      // this.context.stroke();
      // //
      // this.context.beginPath();
      // this.context.arc(center.x, center.y, 5, 0, 2 * Math.PI);
      // this.context.stroke();
      // //
      // this.context.beginPath();
      // this.context.arc(end.x, end.y, 5, 0, 2 * Math.PI);
      // this.context.stroke();

      const cnt = it + 1;
      // console.log(it)

      const dD = new PointVector(((start.x - center.x) / frame) * cnt, ((start.y - center.y) / frame) * cnt);
      const ddd = new PointVector(start.x - dD.x, start.y - dD.y);


      const ldD = new PointVector(((center.x - end.x) / frame) * cnt, ((center.y - end.y) / frame) * cnt);
      const lddd = new PointVector(center.x - ldD.x, center.y - ldD.y);

      const gdD = new PointVector(((ddd.x - lddd.x) / frame) * cnt, ((ddd.y - lddd.y) / frame) * cnt);
      const gddd = new PointVector(ddd.x - gdD.x, ddd.y - gdD.y);
      // position.sub(dD)
      this.context.clearRect(0, 0, 9999, 9999);
      this.context.beginPath();
      // this.context.strokeStyle = '#FF0000';
      // this.context.arc(ddd.x, ddd.y, 1, 0, 2 * Math.PI);
      this.context.arc(gddd.x, gddd.y, 3, 0, 2 * Math.PI);
      this.context.drawImage(moon, gddd.x - 100, gddd.y - 100)
      this.context.drawImage(ducktaek, ddd.x - 300, ddd.y - 200)
      this.context.drawImage(duckboon, lddd.x, lddd.y - 200)
      // this.context.arc(lddd.x, lddd.y, 1, 0, 2 * Math.PI);
      // this.context.arc(ddd.x - lddd.x, ddd.y - lddd.y, 1, 0, 2 * Math.PI);
      this.context.stroke();

      // console.log('-->', ddd.x / 100, ddd.x, ddd.y);
      //
      // this.context.beginPath();
      // this.context.moveTo(start.x,  start.y);
      // this.context.lineTo(center.x,  center.y);
      // this.context.stroke();
      // this.context.beginPath();
      // this.context.moveTo(center.x,  center.y);
      // this.context.lineTo(end.x,  end.y);
      // this.context.stroke();
    });
  }
}
