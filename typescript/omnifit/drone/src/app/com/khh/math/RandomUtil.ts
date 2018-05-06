import { Observable } from 'rxjs/Observable';
import { Point } from 'app/com/khh/graphics/Point';
import { Obj } from 'app/com/khh/obj/Obj';
import { interval } from 'rxjs/observable/interval';
import {Subscription} from 'rxjs/Subscription';
import {isFunction, isNullOrUndefined} from 'util';
export class RandomUtil {




  static random(min?: number, max?: number) {
    if(isNullOrUndefined(min)){
      return Math.random();
    }else if(!isNullOrUndefined(min) && isNullOrUndefined(max)){
      return Math.random()*min;
    }else{
      return Math.random() * (max - min) + min;
    }
  }

  // // min (포함) 과 max (포함) 사이의 임의 정수를 반환
  // // Math.round() 를 사용하면 고르지 않은 분포를 얻게된다!
  // static getRandomIntInclusive(min: number, max: number) {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }
  // // min (포함) 과 max (불포함) 사이의 임의 정수를 반환
  // // Math.round() 를 사용하면 고르지 않은 분포를 얻게된다!
  // static getRandomInt(min: number, max: number) {
  //   return Math.floor(Math.random() * (max - min)) + min;
  // }
  // // min (포함) 과 max (불포함) 사이의 난수를 반환
  // static getRandomArbitrary(min: number, max: number) {
  //   return Math.random() * (max - min) + min;
  // }
  // // 0 (포함) and 1 (불포함) 난수를 반환
  // static getRandom() {
  //   return Math.random();
  // }
}
