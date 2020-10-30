import {Draw} from "@src/draw/Draw";
import {Rectangle} from "@src/domain/Rectangle";
import {Point} from "@src/domain/Point";
import {Obj} from "@src/object/obj/Obj";
// import {engine} from "@src/index";
import {MathUtil} from "@src/math/MathUtil";
import {Optional} from "@src/optional/Optional";
const {range, fromEvent, interval, Observable, of, Subscription, timer} = require('rxjs');
import {config} from "@src/config";

export class TriangleObj extends Obj {


    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, avaliablePlace: Rectangle = new Rectangle(new Point(0, 0), new Point(0, 0))) {
        super(canvas, context, avaliablePlace);
    }

    draw() {

        // Filled triangle
        // ctx.beginPath();
        // ctx.moveTo(25, 25);
        // ctx.lineTo(105, 25);
        // ctx.lineTo(25, 105);
        // ctx.fill();

        // Stroked triangle
        this.context.beginPath();
        let startX = MathUtil.getValueByTotInPercent(this.canvas.width, this.avaliablePlace.start.x);
        let startY = MathUtil.getValueByTotInPercent(this.canvas.height, this.avaliablePlace.start.y);
        let endX = MathUtil.getValueByTotInPercent(this.canvas.width, this.avaliablePlace.end.x);
        let endY = MathUtil.getValueByTotInPercent(this.canvas.height, this.avaliablePlace.end.y);
        this.context.moveTo(startX, startY);
        this.context.lineTo(endX, endY);
        this.context.lineTo(startX, endY);
        this.context.closePath();
        this.context.stroke();
        this.context.font = '20px serif';
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";

        let yGap = Math.abs(endY - startY);
        let xGap = Math.abs(endX - startX);
        let mGap = Math.sqrt(Math.pow(yGap, 2) + Math.pow(xGap, 2));
        this.context.fillText(yGap.toFixed(3), startX,  startY + ((yGap) / 2));

        this.context.fillText(mGap.toFixed(3), startX + (xGap / 2),  startY + ((yGap) / 2));

        this.context.textBaseline = "top";
        this.context.fillText(xGap.toFixed(3), startX + (xGap / 2),  endY);

        // 기울기
        // https://ko.wikihow.com/%EC%A7%81%EC%84%A0%EC%9D%98-%EA%B8%B0%EC%9A%B8%EA%B8%B0-%EA%B5%AC%ED%95%98%EB%8A%94-%EB%B2%95
        // https://ko.khanacademy.org/math/cc-eighth-grade-math/cc-8th-linear-equations-functions/8th-slope/a/slope-formula
        // http://m.ebsmath.co.kr/resource/rscView;jsessionid=dF1YRqf9y5ErOvRxl6w10o9gahO02xKQ92W6cMYlRx5ChNyZVmimrB1Q18saM4oE?cate=10096&cate2=10149&cate3=10155&rscTpDscd=RTP10&grdCd=MGRD02&sno=22097&historyYn=study&ts=ts&isBot=false&viaType=I&isGalaxyS=false&isWin10=false&isAndroid=false&isLG=false&isIOS=false&currentDate=20201028171444&ieVersion=&isMobile=false&isIE=false&userOs=etc&isIOSChrome53=false&remoteIp=112.217.122.28&ieSquare=&prefixURLCheck=REAL&histSeq=7749484&urlSno=16580&userBrowser=chrome&isLoginChk=N&html5Support=true&isHtml5Support=true
        // https://ko.khanacademy.org/math/cc-eighth-grade-math/cc-8th-linear-equations-functions/8th-slope/v/converting-to-slope-intercept-form
    }

}
