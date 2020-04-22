import {Item} from "./Item";
import {BehaviorSubject} from "rxjs";
// import {Type} from "code/Type"
// import {Type} from "type/Type"
export class Essence {

    private _name: string;
    private _negative: Item<number>;
    private _positive: Item<number>;
    // constructor(name: string, nagativeName: string, positiveName: string, value: number = 50) {
    constructor(name: string, nagativeName: string, positiveName: string) {
        this._name = name;
        // const positive = Math.max(0, Math.min(100, value));
        // const negative = 100 - positive;
        // this._negative = new Item<number>(nagativeName, positive);
        // this._positive = new Item<number>(positiveName, negative);
        this._negative = new Item<number>(nagativeName, 50);
        this._positive = new Item<number>(positiveName, 50);
    }

    get name(): string {
        return this._name;
    }
    get negativeName(): string {
        return this._negative.name;
    }
    get positiveName(): string {
        return this._positive.name;
    }
    get negativeValue(): number {
        return this._negative.value;
    }
    get positiveValue(): number {
        return this._positive.value;
    }
    get value(): number {
        return this._positive.value;
    }
    set value(value: number) {
        const positive = Math.max(0, Math.min(100, value));
        const negative = 100 - positive;
        this._positive.value = positive;
        this._negative.value = negative;
    }

}
