import {ConvertUtil} from '../../lib-typescript/com/khh/convert/ConvertUtil';
import {ObjectMapper} from 'json-object-mapper';
import {RandomUtil} from '../../lib-typescript/com/khh/random/RandomUtil';

// const map = new Map<string, string>();
const arr = new Array<string>();
arr.push('gg')
// map.set('11', '11vv');
// console.log(ConvertUtil.objToJson(map));
// console.log(Object.prototype.toString.call(map));
// console.log(Object.prototype.toString.call(arr));
// console.log(typeof map);
// const gg = '  fsfs  s  ';
// console.log(gg.trim());


class A {
    name = 'ggg'
}
class B {

    age = '5'
    a = new A();
}

// arr.push(new B());
// console.log(ConvertUtil.objToJson(new B()));
console.log(ConvertUtil.objToJson(arr));


let json = { "age": 'gg', "a": {"name":"ggg"} };

// let testInstance: B = ObjectMapper.deserialize(B, json);
// console.log(testInstance)

var trigger = "rooms/asd",
    // regexp = new RegExp('^[1-9]\d{0,2}$'),
    regexp = new RegExp('rooms/'),
    test = regexp.test(trigger);
console.log(test + ""); // will display true
console.log(RandomUtil.uuid()); // will display true