function ClassDecorator1(param: any) {
    console.log(param); // ƒ Car(name, price) {
                              //   this.name = name;
                              //   this.price = price;
                              // }
    return function(constructor: any) {
        return <any>class extends constructor {
            name = this.name || 'S2M6';
            color = this.color || 'b2lack';
            somValue = param.somValue;
        }
    }
}

@ClassDecorator1({somValue: 'hello'})
class Car {
    name: string;
    price: number;
    type: string;

    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }

}
console.log(new Car('vvv',11))