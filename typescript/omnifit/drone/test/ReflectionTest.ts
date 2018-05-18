// import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/operator/map';
import {Subject} from 'rxjs/Subject';

// class ReflectionTest {
//
//     public name = 'name';
//     constructor() {
//         console.log('reflection test');
//     }
// }
//
// const a = new ReflectionTest();
// const arr = Object.getOwnPropertyNames(a);
// console.log(arr);
//
// let className:any = ReflectionTest;
// let aa = new className();// the members will have value undefined
// console.log(aa.name)
// PrintTypeNames<T>(obj: T) {
//     const objectKeys = Object.keys(obj) as Array<keyof T>;
//     for (let key of objectKeys)
//     {
//         console.Log('key:' + key);
//     }
// }

class A {
    private a1 = void 0;
    private a2 = void 0;
}

class B extends A {
    private a3 = void 0;
    private a4 = void 0;
}

class C extends B {
    private a5 = void 0;
    private a6 = void 0;
}

class Describer {
    private static FRegEx = new RegExp(/(?:this\.)(.+?(?= ))/g);
    static describe(val: Function, parent = false): string[] {
        var result = [];
        if (parent) {
            var proto = Object.getPrototypeOf(val.prototype);
            if (proto) {
                result = result.concat(this.describe(proto.constructor, parent));
            }
        }
        result = result.concat(val.toString().match(this.FRegEx) || []);
        return result;
    }
}

console.log(Describer.describe(A)); // ["this.a1", "this.a2"]
console.log(Describer.describe(B)); // ["this.a3", "this.a4"]
console.log(Describer.describe(C, true)); // ["this.a1", ..., "this.a6"]