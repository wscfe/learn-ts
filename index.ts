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
  return name
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
// type largeSize = {
//   name: string;
// }

// type smallSize = {
//   age: number
// }

// // type size = largeSize | smallSize
// type size = largeSize & smallSize
// const mySize: size = {
//   name: '121',
//   age: 18
// }

interface largeSize {
  name: string;
}

interface smallSize {
  age: number
}

type TType = {
  height: number
}

// 可以看到class类不仅可以实现interface，也可以实现type类型
class MyClass implements TType {
  height: number
  constructor (height: number) {
    this.height = height
  }
}

// 可以看到接口可以继承type
interface size extends largeSize, smallSize, TType {} // 接口可以使用extends去继承其他的接口
type size2 = largeSize & smallSize // 接口也可以使用 &符号去合并两个接口，并使用一个类型别名
type size3 = largeSize | smallSize // 接口也可以使用 ｜ 符号

// 可以看出interface比较灵活
let mySize: size = {
  name: '123',
  age: 18,
  height: 90,
}


/* 内置对象 */
// 1. ECMAAcript对象
const b: Boolean = new Boolean(10)

const  e: Error = new Error("Error occurred")

const d: Date = new Date()

const r: RegExp = new RegExp(/[a-z]/)


// 2. DOM和BOM对象
const body: HTMLElement = document.body

const allDiv: NodeList = document.querySelectorAll('div')

document.addEventListener('click', (e: MouseEvent) => {
  // do something
  console.log(e.target)
})


/* 类型别名 */
// 1. 使用type创建类型别名， 类型别名常用于联合类型
//  比如我定义了许多接口，但是有些场景是需要一些接口的组合比如说使用 ｜ & 等符号来对不同的接口的组合适应不同使用场景
// 类型别名也可以针对其他的类型做动态组合
// 类型别名不能继承，只能组合，想要继承只能通过定义新的类型去组合其他的类型别名实现继承的效果
type Name = string// 给string类型定义一个Name的别名 // 看着像定义变量，其实不是，在ts编译之后会自动删除
type NameResolver = () => string // 给一个函数定义了一个类型别名
type NameOrNameResolver = Name | NameResolver // 给上面两种类型做组合

const getName2: (value: NameOrNameResolver) => Name = (n: NameOrNameResolver) => {
  if (typeof n === 'string') {
    return n;
  } else {
    return n()
  }
}


/* 字符串字面量类型 */
// 1. 字符串字面量类型用来约束取值只能是某几个字符串中的一个
type EventNames = 'click' | 'scroll' | 'mousemove'
// 类型别名和字符串字面量类型都是使用type进行定义

/* 元组 */
// 1. 元组为固定长度，超出范围的元素不能保证其类型【根据元组元素的所有类型的联合类型处理】
const Tom: [string, number] = ['tom', 23]

Tom[0].slice(1)
Tom![1].toFixed(2) // TS中！表示前一个变量不能为空【null/undefied】

// 2. 越界元素，越界元素的类型会被限制为元组中每个类型的联合类型

const jack: [string, number] = ['name', 18]

// jack.push(true) // 报错： type 'boolean' is not assignable to parameter of type 'string | number'



/* 枚举类型 */
// 枚举成员会被赋值为从0开始递增的数字，同时也会对枚举值到枚举名进行反向映射

// 1. 基础使用
enum Days {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}
// console.log(Days)
// console.log(Days['Fri']) // 枚举支持正向获取值
// console.log(Days[1]) // 枚举支持反向获取key的值

// 2. 手动赋值
// 没有给枚举手动赋值，会从0开始，也可以指定某一个枚举进行赋值，后面的枚举选项会自动根据前面设置的值继续进行累加
enum Days2 {
  Mon,
  Tue = 20,
  Wed,
  Thu,
}
console.log(Days2)


/* 类与接口 */
// 一般来说，一个类只能继承自另一个类，一个类可以实现多个接口
// 有时候，不同的类直接可以有一些共有的特性，这个时候就可以把这些共有的特性提取出来成为一个interface【接口】
// 类使用implements关键字来实现。


// 1. 类实现接口
interface Alarm {
  alert(): void
}

class Door {}

class SecurityDoor extends Door implements Alarm { // 当前类继承了一个实现Alarm接口的类
  alert() {
    console.log('这是一个拥有报警的安全门')
  }
}
new SecurityDoor().alert()

// 一个类可以实现多个接口
interface Light {
  lightOn(): void;
  lightOff(): void;
}

class Car implements Alarm, Light { // 一个类只能继承一个类，但是可以实现多个接口
  alert(){
    console.log('this is my car')
  }
  lightOn() {
    console.log('打开车灯')
  }
  lightOff() {
    console.log('关闭车灯')
  }
}


// 2. 接口继承接口
// 接口与接口直接是可以继承的，而且一个接口可以继承多个其他的接口
interface LightableAlarm extends Alarm, Light {
  name: string
}


// 3. 接口继承类
// 正常的面向对象【OOP】的语言中，接口是不能继承类的，但是在TS中确实可以的
// 为什么呢？ 因为在TS中接口继承类，实际上继承的还是接口，哈哈

class Point {
  public constructor(public x: number, public y: number){}
}

interface PonitInstanceType { // 接口继承类的时候等价继承这个接口
  x: number;
  y: number;
}

// 当我们在声明一个class Point的时候，TS除了会创建一个名为Point的类之外，
// 还会创建一个名为Point的实例类型（实例的类型）
// 这个Point的实例类型不包括构造函数，静态属性和静态方法
// 也就是说声明Point类时创建的Point类型只包含其中的实例属性和实例方法
interface Point3D extends Point {
  z: number
}

const point3d: Point3D = {
  x: 10,
  y: 10,
  z: 10
}


/* 泛型 */
// 泛型【generics】是指在定义函数，接口，类的时候，不预先指定具体的类型，而是在使用的时候在指定一种类型的特性

// 1. 基础使用
const createArray = (length: number, value: any): any[] => {
  const array: any[] = [];
  for (let i = 0; i < length; ++i) {
    array[i] = value
  }
  return array
}
// console.log(createArray(5, 'xxx'))

// 注意泛型 T 在尖头函数中位置和普通函数中位置是不一样的
// 普通函数在 泛型T 是在function关键字后面即可， 箭头函数的 T 泛型在尖头函数括号的首部哦
const createArrayWithGenerics: ICreateArrayWithGenerics = <T>(length: number, value: T): T[] => {
  const array: T[] = []
  for(let i = 0; i < length; ++i) {
    array[i] = value
  }
  return array
}
// console.log(createArrayWithGenerics(3, '100'))

const obj: ICreateArrayWithGenerics2<string> = {
  createArray: <T>(length: number, value: T): T[] => {
    const array: T[] = []
    for(let i = 0; i < length; ++i) {
      array[i] = value
    }
    return array
  }
}
console.log(obj.createArray(3, '100'))


// 2. 多个类型泛型参数
// 定义泛型的时候，可以一次性定义多个参数
const swapWithGenerics = <T, U>(tuple: [T, U]): [U, T] => {
  return [tuple[1], tuple[0]]
}
// 调用定义了泛型的函数时候，函数名称后面需要加上指定的泛型确定类型， 如果不指定TS会自动推算泛型的具体类型
console.log(swapWithGenerics<string, number>(['gogog', 9999]))


// 3. 泛型约束
interface IConstraint {
  length: number;
}
const genericsConstraint = <T extends IConstraint>(value: T): void => {
  console.log(value.length)
}
// console.log(genericsConstraint([1,2,3,4]))

// 多个类型参数之间也可以相互进行约束
const copyFieldsWithGenericsConstraint = <T extends U, U>(target: T, source: U) => {
  for (let id in source) {
    // target[id] = (source as T)[id]
    target[id] = (<T>source)[id]
  }
}

// 4. 泛型接口

// 使用接口的形式定一个一个函数需要符合的形状
// 可以使用含有泛型的接口来定义函数的形状
interface ICreateArrayWithGenerics {
  <T>(length: number, value: T): T[] 
}

// 可以泛型参数提前到接口名称上面， 【这样的话整个接口里面都可以使用这个泛型参数了】不提出来的话只能在当前函数中使用
interface ICreateArrayWithGenerics2<T> {
  createArray: (length: number, value: T) => T[]
}


// 5. 泛型类
// 与泛型接口类似，泛型也可以用于类的类型定义中
class GenericsClass<T> {
  public constructor(public leftValue: T, public rightValue: T) {
  }

  addValue(): T {
    return this.leftValue || this.rightValue
  }
}

console.log(new GenericsClass<number>(0, 9999).addValue())


// 6. 泛型参数的默认类型
// 当使用泛型的时候没有在代码中直接指定类型参数的时候，从实际参数中也无法推测出类型的时候，这个默认类型就会起作用
const createArrayWithDefaultGenerics = <T = string>(length: number, value: T): T[] => {
  const array: T[] = []
  for (let i = 0; i < length; ++i) {
    array[i] = value
  }
  return array
}

// 不过大部分情况都是可以根据用户传入参数推断出泛型参数的实际类型，然后进行使用，此时我们的默认泛型参数也就没啥用了，
// 因此使用场景并不是很多


/* 声明合并，包括type和interface的类型和接口的合并 */
// 1. 函数的合并 【通过重载】


// 2. 接口的合并
interface Alarm3 {
  name: string;
  // alert(name: string): string
}
interface Alarm3 {
  age: number;
  name: string;
  // alert(age: number): number
}

// 上面两个同名的接口会自动进行合并
const alarm: Alarm3 = {
  name: 'name',
  age: 20,
}



// 3. 类型type的合并 type类型 & ｜ 符号的使用
// type类型不能拥有相同的名字和接口不一样
type T = {
  name: string
}

type U = {
  age: number
}

type M1 = T & U // 将两个类型进行合并操作, 生成的类型每个都必须符合条件
const testValue1: M1 = {
  name: 'tst',
  age: 18
}

type M = T | U; // 将两个类型合并操作，与上面不同的是生成的类型只需要满足一个类型即可
const testValue: M = {
  name: 'aaa',
  age: 10
}