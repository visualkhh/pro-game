// import * as Processing from 'assets/javascript/processing-1.4.1';
import {AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
// import {hello} from 'assets/javascript/omnifit';
// Observable operators
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import {DeviceManager} from './com/khh/omnifit/drive/DeviceManager';
import {AWResourceManager} from './com/khh/omnifit/game/five-fan/AWResourceManager';
import {AWStageManager} from './com/khh/omnifit/game/five-fan/AWStageManager';
import {Alarm} from './com/khh/omnifit/game/five-fan/obj/alarm/Alarm';
import {BackGround} from './com/khh/omnifit/game/five-fan/obj/background/BackGround';
import {Guest1} from './com/khh/omnifit/game/five-fan/obj/game/Guest1';
import {Guest2} from './com/khh/omnifit/game/five-fan/obj/game/Guest2';
import {Guest3} from './com/khh/omnifit/game/five-fan/obj/game/Guest3';
import {MainBackGround} from './com/khh/omnifit/game/five-fan/obj/game/MainBackGround';
import {Cloud} from './com/khh/omnifit/game/five-fan/obj/intro/Cloud';
import {IntroPopup} from './com/khh/omnifit/game/five-fan/obj/intro/IntroPopup';
import {Star} from './com/khh/omnifit/game/five-fan/obj/intro/Star';
import {Title} from './com/khh/omnifit/game/five-fan/obj/intro/Title';
import {Score} from './com/khh/omnifit/game/five-fan/obj/score/Score';
import {Timer} from './com/khh/omnifit/game/five-fan/obj/timer/Timer';
import {AWStageGame} from './com/khh/omnifit/game/five-fan/stage/AWStageGame';
import {AWStageIntro} from './com/khh/omnifit/game/five-fan/stage/AWStageIntro';
import {Fan} from "./com/khh/omnifit/game/five-fan/obj/game/Fan";
import {WigMan} from "./com/khh/omnifit/game/five-fan/obj/game/WigMan";

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
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  private title = 'app';

  private canvas: HTMLCanvasElement;
  private stageManager: AWStageManager;
  private context: CanvasRenderingContext2D | null;
  @ViewChild('canvas') public canvasElementRef: ElementRef;
  private resourceManager: AWResourceManager;
  private deviceManager: DeviceManager;
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
    this.stageManager = AWStageManager.getInstance(this.canvas);
    this.deviceManager = DeviceManager.getInstance();
    this.resourceManager = AWResourceManager.getInstance();

    /////////////////stage Intro
    const droneStageIntro = new AWStageIntro(this.canvas);
    const background = new BackGround(droneStageIntro, 0, 0, 0);
    background.index = 0;
    droneStageIntro.pushObj(background);
    const introTitle = new Title(droneStageIntro, 0, 0, 0, AWResourceManager.getInstance().resources('titleImg'));
    introTitle.index = 50;
    droneStageIntro.pushObj(introTitle);
    const touchScreen = new IntroPopup(droneStageIntro, 0, 0, 0, AWResourceManager.getInstance().resources('intro_text_02Img'));
    touchScreen.index = 150;
    droneStageIntro.pushObj(touchScreen);
    //cloud
    for (let i = 51; i < 100 ; i++) {
      const cloud = new Cloud(droneStageIntro, 0, 0, 0, AWResourceManager.getInstance().resources('ef_smokeImg'));
      cloud.index = i;
      droneStageIntro.pushObj(cloud);
    }
    //star
    for (let i = 100; i < 120 ; i++) {
      const star = new Star(droneStageIntro, 0, 0, 0);
      star.index = i;
      droneStageIntro.pushObj(star);
    }

    ///////////////Stage Game
    const droneStageGame = new AWStageGame(this.canvas);
    //background
    droneStageGame.pushObj(background);

    const mainBackGround = new MainBackGround(droneStageIntro, 0, 0, 0, AWResourceManager.getInstance().resources('main_bgImg'));
    mainBackGround.index = 2;
    droneStageGame.pushObj(mainBackGround);

    //geust
    const geust1 = new Guest1(droneStageGame, 0, 0, 0);
    geust1.index = 11;
    droneStageGame.pushObj(geust1);
    const geust2 = new Guest2(droneStageGame, 0, 0, 0);
    geust2.index = 10;
    droneStageGame.pushObj(geust2);
    const geust3 = new Guest3(droneStageGame, 0, 0, 0);
    geust3.index = 13;
    droneStageGame.pushObj(geust3);

    // const stepSize = (this.canvas.width / 5) - (AWResourceManager.getInstance().resources('fan_01Img').width / 2);
    // console.log('canvas width = ' + this.canvas.width);
    // console.log('fan_01Img width = ' + AWResourceManager.getInstance().resources('fan_01Img').width);
    // let wpoint = 0;
    let fanOrder = 1;
    for (let i = 500; i <= 509; i++) {
      let fan = new Fan(droneStageGame, AWResourceManager.getInstance().resources('fan_01Img'), fanOrder++);
      fan.index = i;
      console.log(fan.order);
      droneStageGame.pushObj(fan);
    }

    //man
    const man = new WigMan(droneStageGame, AWResourceManager.getInstance().resources('head_01Img'), fanOrder++);
    man.index = 600;
    droneStageGame.pushObj(man);

    const score = new Score(droneStageGame, 0, 0, 0, AWResourceManager.getInstance().resources('gage_00Img'));
    score.index = 1001;
    droneStageGame.pushObj(score);

    const alarm = new Alarm(droneStageGame, 0, 0, 0, AWResourceManager.getInstance().resources('alarm_iconImg'));
    alarm.index = 1002;
    droneStageGame.pushObj(alarm);

    const timer = new Timer(droneStageGame, 0, 0, 0, AWResourceManager.getInstance().resources('gage_00Img'));
    timer.index = 1003;
    droneStageGame.pushObj(timer);

    this.stageManager.pushStage(droneStageIntro);
    this.stageManager.pushStage(droneStageGame);
    this.stageManager.onCreate();
    this.stageManager.onStart();

  }

}
