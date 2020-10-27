export class MathUtil {
    static getMinByObjectArray(objectArray: Array<any>, varName: string) {
        let min;
        if (varName && objectArray && objectArray.length > 0) {
            min = objectArray[0][varName];
            for (let i = 1; i < objectArray.length; i++) {
                min = Math.min(min, objectArray[i][varName]);
            }
        }
        return min;
    }

    static getMaxByObjectArray(objectArray: Array<any>, varName: string) {
        let max;
        if (varName && objectArray && objectArray.length > 0) {
            max = objectArray[0][varName];
            for (let i = 1; i < objectArray.length; i++) {
                max = Math.max(max, objectArray[i][varName]);
            }
        }
        return max;
    }

    static getSumByObjectArray(objectArray: Array<any>, varName: string) {
        let sum = 0;
        if (varName && objectArray && objectArray.length > 0) {
            for (let i = 0; i < objectArray.length; i++) {
                sum += objectArray[i][varName];
            }
        }
        return sum;
    }
    static radians(aAngle: number): number {
        return aAngle / 180 * Math.PI;
    }

    // static createCanvas(w, h) {
    //     let canvas = document.createElement('canvas');
    //     canvas.width = w;
    //     canvas.height = h;
    //     return canvas;
    // }
    //
    // static copyCanvas(canvas) {
    //     let newCanvas = document.createElement('canvas');
    //     newCanvas.width = canvas.width;
    //     newCanvas.height = canvas.height;
    //     context = newCanvas.getContext('2d');
    //     context.drawImage(canvas, 0, 0);
    //     return newCanvas;
    // }

    //end - start    끝과 시작의 사이길이를 취득한다.
    static getBetweenLength(start: number, end: number) {
        return end - start;
    }

    //전체값에서 일부값은 몇 퍼센트? 계산법 공식    tot에서  data는 몇%인가.
    static getPercentByTot(tot: number, data: number) {
        /*
        전체값에서 일부값은 몇 퍼센트? 계산법 공식
        일부값 ÷ 전체값 X 100
        예제) 300에서 105는 몇퍼센트?
        답: 35%
        */
        return (data / tot) * 100;
    }

    //전체값의 몇 퍼센트는 얼마? 계산법 공식    tot에서  wantPercent는 몇인가?
    static getValueByTotInPercent(tot: number, wantPercent: number) {
        /*
        전체값 X 퍼센트 ÷ 100
        예제) 300의 35퍼센트는 얼마?
        답) 105
         */
        return (tot * wantPercent) / 100;
    }

    //숫자를 몇 퍼센트 증가시키는 공식    tot에서  wantPercent을 증가 시킨다
    static getValuePercentUp(tot: number, wantPercent: number) {
        /*
        숫자를 몇 퍼센트 증가시키는 공식
        숫자 X (1 + 퍼센트 ÷ 100)
        예제) 1548을 66퍼센트 증가하면?
        답) 2569.68
         */
        return tot * (1 + wantPercent / 100);
    }

    //숫자를 몇 퍼센트 감소하는 공식    tot에서  wantPercent을 증감 시킨다
    static getValuePercentDown(tot: number, wantPercent: number) {
        /*
        숫자를 몇 퍼센트 감소하는 공식
        숫자 X (1 - 퍼센트 ÷ 100)
        예제) 1548을 66퍼센트 감소하면?
        답) 526.32
         */
        return tot * (1 - wantPercent / 100);
    }

    //바례식
    // A:B = C:X    => 30:50 = 33 : x
    // 30X = 50*33
    // X = BC / 30

}
