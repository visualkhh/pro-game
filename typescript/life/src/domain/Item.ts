export class Item<T> {

    constructor(private _name: string, private _value: T) {
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }


    get value(): T {
        return this._value;
    }

    set value(value: T) {
        this._value = value;
    }
}
