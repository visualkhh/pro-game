import {ValidUtil} from '../valid/ValidUtil';

export class ConvertUtil {


    public static decimalToHexString(num: number): string {
        if (num < 0) {
            num = 0xFFFFFFFF + num + 1;
        }
        num = Number(num.toFixed(0));
        return num.toString(16).toUpperCase();
    }

    public static objToGetURL(obj: any): string {
    //const httpParams = Object.getOwnPropertyNames(param)
    //.reduce((p, key) => p.set(key, param[key]), new HttpParams());
        return Object.keys(obj).reduce((prev, key, i) => (
            `${prev}${i!==0?'&':''}${key}=${obj[key]}`
        ), '');
    }
    public static mapToJson(map: Map<string, any>): string {

        return JSON.stringify(
            Array.from(
                map.entries(),
            ).reduce((o: any, [key, value]) => {
                    o[key] = value;
                    return o;
                }, {}));
    }
    public static jsonToMap(jsonStr: any): Map<string, string> {
        return new Map(JSON.parse(jsonStr));
    }
    // public static strMapToObj(strMap: Map<string, string>) {
    //     const obj = Object.create(null);
    //     for (const [k, v] of strMap) {
    //         // We don’t escape the key '__proto__'
    //         // which can cause problems on older engines
    //         obj[k] = v;
    //     }
    //     return obj;
    // }
    public static objToStrMap(obj: any): Map<string, string> {
        const strMap = new Map();
        for (const k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;
    }

    // public static strMapToJson(strMap: Map<string, string>) {
    //     return JSON.stringify(this.strMapToObj(strMap));
    // }
    public static jsonToStrMap(jsonStr: string) {
        return this.objToStrMap(JSON.parse(jsonStr));
    }

    static strToObject(message: string): any {
        return JSON.parse(message);
    }

    static objToJson(obj: any): string {
        return JSON.stringify(obj);
    }
    static objToMap(obj: any): Map<string, any> {
        const mp = new Map<string, any>();
        Object.keys ( obj ). forEach ((k) => { mp.set(k, obj[k]); });
        return mp;
    }
    static mapToObj(map: Map<string, any>): any {
        const obj = {} as any;
        map.forEach ((v, k) => { obj[k] = v; });
        return obj;
    }

    static toObject(obj: any): any {
        //console.log(Object.prototype.toString.call(obj));
        if (ValidUtil.isMap(obj)) {
            const map = obj as Map<string, any>;
            obj = this.mapToObj(map);
        }
        if (ValidUtil.isArray(obj)) {
            const arr = obj as any[];
            for (let i = 0; i < arr.length; i++) {
                arr[i] = this.toObject(arr[i]);
            }
        }
        // if (ValidUtil.isFunction(obj)) {
        //     obj = this.toObject(obj());
        // }
        if (ValidUtil.isObject(obj)) {
            for (const property in obj) {
                obj[property] = this.toObject(obj[property]);
            }
        }

        return obj;

    }

    static iteratorToArray <T>(it: any): T[] {
        return Array.from(it) as T[];
    }
    // /**
    //  * @deprecated
    //  * @param {T} obj
    //  * @returns {T}
    //  */
    // static clone <T>(obj: T): T {
    //     if (null == obj || 'object' !== typeof obj) {
    //         return obj;
    //     }
    //     const copy = new Object() as any;
    //     for (const attr in obj) {
    //         if (obj.hasOwnProperty(attr)) {
    //             copy[attr] = obj[attr];
    //         }
    //     }
    //     return copy;
    // }
    // static merge <T>(target: T, obj: any): T {
    //     if (null == obj || 'object' !== typeof obj) {
    //         return obj;
    //     }
    //     for (const attr in obj) {
    //         if (obj.hasOwnProperty(attr)) {
    //             target[attr] = obj[attr];
    //         }
    //     }
    //     return target;
    // }

    static toJson(obj: any): string {
        const at = this.toObject(obj);
        return JSON.stringify(at);

    }
    static concatenateToAttribute(object_o: any){
        return ConvertUtil.concatenateToString(object_o,"="," ","'");
    };
    static concatenateToParameter(object_o: any){
        return ConvertUtil.concatenateToString(object_o,"=","&","");
    };
    static concatenateToString=function(object_o: any,unionString_s = '=', spilString_s = ' ', pairString_s =""){
        var results = [];
        for (var property in object_o) {
            var value = object_o[property];
            if (value){
                results.push(property.toString() +unionString_s+ pairString_s + value+pairString_s);
            }
        }

        return results.join(spilString_s);
    };
}
