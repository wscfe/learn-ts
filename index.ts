/* 对象类型的接口 */
// 1. 任意属性
interface Person {
  name: string;
  age: number;
  // 一旦定义了任意属性，那么确定属性和可选属性的类型都必须是他的类型的子集
  [key: string]: string | number;
}

let foolishYou: Person = {
  name: "boy",
  age: 10,
  height: 180, // 使用了任意属性类型的方式定义的属性
}


// 2. 只读属性
interface Person2 {
  // 只读属性一般不能设置为可选类型
  readonly identify?: number; // 只读属性在初始化之后不能修改,没有初始化也不能继续赋值
  name: string;
  age: number
}

let you: Person2 = {
  // identify: 1000,
  name: "xiaowang",
  age: 18
}
// you.identify = 9000



/* 数组的类型 */
// 1. 数组泛型[什么是泛型？]
let arr: Array<number | string> = [1, '1']

// 2. 接口表示数组
interface IArray {
  [index: number]: number | string
}
let arr2: IArray = [1, 3, 4]

// 3. 类数组
interface IArgument {
  [index: number]: any;
  length: number;
  callee: Function;
}
function foo() {
  let arg: IArgument = arguments
  return arg;
}


/* 函数类型 */
// 1. 接口定义函数的形状
interface SeatrchFoo {
  (a: string, b: number): boolean; // 可以看到用接口定义函数类型是需要属性的，接口中直接写函数类型即可
  // name: string; // 还可以在函数中加上属性
}
const FooFunc: SeatrchFoo = function(a, b) {
  return !(a + b)
}
// FooFunc.name = '100'

FooFunc('1', 2)



/* 类型的断言 */
// 1. 将一个联合类型断言为其中一个类型
// 当TS不确定一个联合类型的变量是那种类型的时候，我们只能访问联合类型的所有类型中的共有的属性和方法
interface Cat {
  name: string;
  run(): void // 注意类型中函数的写法，可以1⃣️key: value的形式，也可用当前的形式定义函数类型
}
interface Fish {
  name: string;
  swim(): void;
}
const getName = (animal: (Cat | Fish)) => {
  return animal.name // 只能访问共有的属性或者方法
}
// 如果需要访问联合属性的也有属性或者方法怎么办呢，得先确定当前是哪一种类型，之后再去访问不就行啦
const isCat = (animal: (Cat | Fish)) => {
  (animal as Cat)?.run?.()
}
const isFish = (animal: (Cat | Fish)) => {
  if (typeof (animal as Cat).run === 'function') {
    return true
  }
  return false
}
let cat = {
  name: 'cat',
  run(){}
}
let fish = {
  name: 'fish',
  swim(){}
}
// console.log(isCat(cat))
// console.log(isCat(fish))

// 2. 将一个父类断言为更加具体的子类
class ApiError extends Error {
  code: number = 0; // class中是可以赋值的
}
class HttpError extends Error {
  statusCode: number = 500;
}
const isApiError = (error: Error) => {
  // 根据code属性的类型是否是number类型，同时会将error参数断言成一个ApiError类型
  if (typeof (error as ApiError).code === 'number'){
    return true
  }
  return false
}
const isApiErrorVersion2 = (error: Error) => {
  // 使用instanceof关键字来判断是否是一个类型的实例
  if (error instanceof ApiError){
    return true
  }
  return false
}
// 上面是class的形式, 如果使用interface接口的形式
interface ApiError extends Error {
  code: number
}
interface HttpError extends Error {
  statusCode: number
}
const isHttpError = (error: Error) => { 
  if (typeof (error as HttpError).statusCode) {
    return true
  }
  return false
}

// 3. 将任何一个类型断言成为any 【不推荐使用这种方式】
// window.foo = () => {}
(window as any).foo = () => {} // 可见window下面没有foo属性，但是我们想要强行加上，就需要将window先断言成为any类型，在进行设置


// 4. 将any类型断言成为一个具体类型
// 比如遇到一些老代码，之前的类型是any
const getCacheData = (key: string): any => {
  return (window as any)?.cache?.[key];
}
interface Cat2 {
  name: string
}
// 使用断言的形式写出更好的代码
const cat3 = getCacheData('cat') as Cat2
// 对新定义的变量直接使用接口限制也行
const cat2: Cat2 = getCacheData('cat')
console.log(cat3?.name)
console.log(cat2?.name)

/* 声明文件 */
// 1. 声明语句
declare var jQuery:(selector: string) => any
declare var $:(selector: string) => any
// declare var并没有正真的定一个一个变量，而是这个变量本来就是存在的，但是没有其全局的类型的声明，所有访问不到
// 因此我们需要加上一个declare var的类型全局声明，仅仅用在编译时的检查，在编译的结果中会被删除


// 2. 声明文件
// 把声明语句放在一个*.d.ts的文件中，这个文件就是生命文件
// 一般TS会解析项目中的所有 *.d.ts后缀的类型声明文件, 因此其他的ts文件都是可以使用项目中定义的声明文件中的声明语句类型

/**
 * //  好奇这些声明文件和声明语句是否存在作用域以及模块的定义？？？？
 * declare var 声明全局变量
 * declare function 声明全局方法
 * declare class 声明全局类
 * declare enum 声明全局枚举类型
 * declare namespace 声明（含有子属性的）全局对象
 * interface 和type 声明全局类型
 * export 导出变量
 * export namespace 导出（含有子属性的）全局对象
 * export default ES6的默认导出
 * export =   //commonjs导出模块
 * export as namespace UMD库声明全局变量
 * declare global 扩展全局变量
 * declare module 扩展模块
 */

console.log(jQuery("#root"))

/* 枚举类型 */
// 1. 什么是枚举类型

// 2. 枚举类型如何使用


/* interface VS type */
// 1. 公共：定义object， class function
interface Student {
  name: string;
  age: number;
}
const xiaoming: Student = {
  name: 'xiaownagming',
  age: 18
}

class StudentClass implements Student {
  name: string;
  age: number;
  constructor (name: string, age: number) {
    this.name = name
    this.age = age
  }
}

interface PersonEatBehavior {
  (food: string): string
}

// 可以看出使用interface定义的函数参数没有限制
// 定义的函数类型接口对参数问题： 传了参数才会根据类型中的形参进行约束，不传没有约束，限制必传参数校验失效
const eatMe: PersonEatBehavior = () => {
  return 'string'
}
const eat: PersonEatBehavior = (name: string) => {
  return 'food'
}

// 2. 特别： extends， 相同的接口声明会自动合并
interface Animal {
  name: string;
  age: number;
}
interface Animal {
  height: number
}

const dog: Animal = {
  name: 'haha',
  age: 2,
  height: 20,
}

interface Man {
  name: string;
  age: number;
}

interface SuperMan extends Man {
  fly: boolean;
}

const bird: SuperMan = {
  name: "bird",
  age: 1,
  fly: true
}


// 3. 定义类型别名，不能继承，是一个固定的形状【主要用于别名的操作】
type DogBaseFeature = {
  name: string;
}
type DogSpecialFeature = {
  color: string;
}
type Dog = DogBaseFeature | DogSpecialFeature // 或的关系
// type Dog = DogBaseFeature & DogSpecialFeature // 且的关系，相当于合并两个类型成为一个
const myDog: Dog = {
  name: "xiaohuang",
  color: "red"
}

// 4. 特别： 使用 & 符号进行type合并，or运算【｜】interface 和type都可以使用

// 5. interface 与type直接的转化