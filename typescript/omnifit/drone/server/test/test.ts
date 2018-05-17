
class A {
    name = 1;
    age = 2;
}

const a = [new A(), new A()];
console.log(a.map((it) => it.age))
console.log(new Set(a.map((it) => it.age)))
