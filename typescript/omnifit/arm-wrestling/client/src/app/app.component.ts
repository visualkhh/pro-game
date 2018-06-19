// import * as Processing from 'assets/javascript/processing-1.4.1';
import {AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {hello} from 'assets/javascript/omnifit';
// Observable operators
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import {DeviceManager} from './com/khh/omnifit/drive/DeviceManager';
import {AWResourceManager} from './com/khh/omnifit/game/arm-wresling/AWResourceManager';
import {AWStageManager} from './com/khh/omnifit/game/arm-wresling/AWStageManager';
import {Alarm} from './com/khh/omnifit/game/arm-wresling/obj/alarm/Alarm';
import {BackGround} from './com/khh/omnifit/game/arm-wresling/obj/background/BackGround';
import {Moon} from './com/khh/omnifit/game/arm-wresling/obj/background/Moon';
import {Mountain} from './com/khh/omnifit/game/arm-wresling/obj/background/Mountain';
import {Cloud} from './com/khh/omnifit/game/arm-wresling/obj/cloud/Cloud';
import {IntroIcon} from './com/khh/omnifit/game/arm-wresling/obj/intro/IntroIcon';
import {IntroPopup} from './com/khh/omnifit/game/arm-wresling/obj/intro/IntroPopup';
import {IntroTitle} from './com/khh/omnifit/game/arm-wresling/obj/intro/IntroTitle';
import {Score} from './com/khh/omnifit/game/arm-wresling/obj/score/Score';
import {Star} from './com/khh/omnifit/game/arm-wresling/obj/star/Star';
import {Timer} from './com/khh/omnifit/game/arm-wresling/obj/timer/Timer';
import {AWStageGame} from './com/khh/omnifit/game/arm-wresling/stage/AWStageGame';
import {AWStageIntro} from './com/khh/omnifit/game/arm-wresling/stage/AWStageIntro';
import {Arm} from './com/khh/omnifit/game/arm-wresling/obj/game/Arm';

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
  private droneManager: AWStageManager;
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
    this.droneManager = AWStageManager.getInstance(this.canvas);
    this.deviceManager = DeviceManager.getInstance();
    //resource
    this.resourceManager = AWResourceManager.getInstance();

    //stage Intro
    const droneStageIntro = new AWStageIntro(this.canvas);
    const introTitle = new IntroTitle(droneStageIntro, 0, 0, 0, AWResourceManager.getInstance().resources('intro_text_01Img'));
    introTitle.index = 65;
    const introIcon = new IntroIcon(droneStageIntro, 0, 0, 0, AWResourceManager.getInstance().resources('intro_02Img'));
    introIcon.index = 66;
    const touchScreen = new IntroPopup(droneStageIntro, 0, 0, 0, AWResourceManager.getInstance().resources('intro_text_02Img'));
    touchScreen.index = 67;
    droneStageIntro.pushObj(introTitle);
    droneStageIntro.pushObj(introIcon);
    droneStageIntro.pushObj(touchScreen);
    const background = new BackGround(this.droneManager, 0, 0, 0);
    background.index = 0;
    droneStageIntro.pushObj(background);
    //Stage Game
    const droneStageGame = new AWStageGame(this.canvas);
    //background
    droneStageGame.pushObj(background);

    for (let i = 20; i < 40 ; i++) {
      const star = new Star(this.droneManager, 0, 0, 0);
      star.index = i;
      this.droneManager.pushObj(star);
    }

    //moon
    const moon = new Moon(droneStageGame, 0, 0, 0, AWResourceManager.getInstance().resources('game_bg_moonImg'));
    moon.index = 41;
    droneStageGame.pushObj(moon);
    // droneStageIntro.pushObj(moon);
    //cloud
    for (let i = 50; i < 55 ; i++) {
      const cloud = new Cloud(this.droneManager, 0, 0, 0, AWResourceManager.getInstance().resources('game_bg_cloud_04Img'));
      cloud.index = i;
      this.droneManager.pushObj(cloud);
    }
    for (let i = 55; i < 60 ; i++) {
      const cloud = new Cloud(this.droneManager, 0, 0, 0, AWResourceManager.getInstance().resources('game_bg_cloud_05Img'));
      cloud.index = i;
      this.droneManager.pushObj(cloud);
    }
    //mountain
    const mountain = new Mountain(this.droneManager, 0, 0, 0, AWResourceManager.getInstance().resources('game_bg_mountainImg'));
    mountain.index = 61;
    this.droneManager.pushObj(mountain);

    const arm = new Arm(droneStageGame, 0, 0, 0, AWResourceManager.getInstance().resources('armImg'));
    arm.index = 1000;
    const score = new Score(droneStageGame, 0, 0, 0, AWResourceManager.getInstance().resources('gage_00Img'));
    score.id = 'local';
    score.index = 1001;
    const alarm = new Alarm(droneStageGame, 0, 0, 0, AWResourceManager.getInstance().resources('alarm_iconImg'));
    alarm.index = 1002;
    const timer = new Timer(droneStageGame, 0, 0, 0, AWResourceManager.getInstance().resources('gage_00Img'));
    timer.index = 1003;
    droneStageGame.pushObj(arm);
    droneStageGame.pushObj(score);
    droneStageGame.pushObj(alarm);
    droneStageGame.pushObj(timer);
    this.droneManager.pushStage(droneStageIntro);
    this.droneManager.pushStage(droneStageGame);
    this.droneManager.onCreate(this.canvas);
    this.droneManager.onStart();

  }

}
