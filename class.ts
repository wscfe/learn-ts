/*
 * @Author: wangshicheng
 * @Date: 2021-09-25 12:36:41
 * @Description:  测试es6 class在TS中的使用
 * @FilePath: /ts-expression/class.ts
 */

class A {
  name: string = 'shicheng'; // es7中类的实例属性可以直接在类中进行定义，而不需要在构造函数中定义
  constructor() {
    // this.name = name;
  }
}

class B {
  age;
  constructor(age: number) {
    this.age = age;
  }
}
// 一个class类只能继承一个class，不能进行多继承
// class C extends A, B { } Classes can only extend a single class

/* ES6中类的用法 */
// 1. 属性和方法
// 使用class定义类， 使用constructor定义构造函数
// 通过new生成新实例的时候，会自动调用构造函数
class Animal10 {
  name;
  // 注意在es6的时候，定义属性只能在构造函数中进行定义
  constructor (name: string) { // 构造函数存在的目的只是为了给实例的对象进行初始化， 如果不需要初始化可以不加上
    // 定义类的属性
    this.name = name
  }

  // 定义类的方法，注意方法的写法，不是key： value形式
  sayHi() {
    console.log(this.name)
  }
}
// let myCat = new Animal10('cat')
// console.log(myCat.name)


// 2. 类的继承
// 使用extends关键字实现继承， 子类中使用super关键字调用父类的构造函数和方法
// 注意在构造函数中直接调用super方法，等同于调用父类的构造方法，获取构造方法中的属性
class Cat3 extends Animal10 {
  // constructor (name: string) {
  //   super(name) // 调用父类的构造函数， 这样父类的属性和方法都可以被继承
  // }
  sayName() {
    console.log('extends', this.name)
    super.sayHi()
  }
}

const fooCat = new Cat3('coffee')
fooCat.sayName()


// 3. 存取器 【高版本的似乎不能使用存取器】
// 使用getter和setter可以改变属性的赋值金额读取的行为
class SuperAnimal {
  name: string
  // 构造函数存在的目的就是为了在实例化类的时候做初始化，初始化的参数传到实例化对象的属性中
  constructor(name: string) {
    this.name = name
  }

  /* 会存在相同变量名称的错误， 不知道是不是高级版本的限制，不能使用了 */
  // get name(){
  //   return this.name + "测试名称"
  // }

  // set name(name: string) {
  //   this.name = name
  // }
}

const mySuperAnimal = new SuperAnimal("小帽子")
// console.log(mySuperAnimal.name)


// 静态方法
// 使用static修饰符的方法称为静态方法，静态方法不需要实例化就可以直接通过类名进行调用
class StaticMethod {
  static isStaticMethod (instance: StaticMethod){
    return instance instanceof StaticMethod
  }
}

const staticMethod = new StaticMethod()
// console.log(StaticMethod.isStaticMethod(mySuperAnimal)) // false
// console.log(StaticMethod.isStaticMethod(staticMethod)) // true


/* ES7中类的用法 */
// 1. 实例属性
// es6中实例的属性只能通过构造函数中的this.xxx来进行定义
// es7中则可以直接在类里面定义
class InstanceAttribution {
  // 直接在类中定义属性，并且初始化，
  // 如果需要初始化，还是需要在构造函数中使用
  attributionName: string = 'key'

  sayName() {
    // 注意在类方法中使用类属性，需要通过this引用
    console.log(this.attributionName)
  }
}
const instanceAttribution = new InstanceAttribution()
// console.log(instanceAttribution.attributionName)


// 2. 静态属性
// es7中的static可以定义静态属性，es6中只可以使用static定义静态方法
class StaticAttibution {
  static myName: string = 'shicheng';
}

// 可以通过类名称直接访问 静态属性和静态方法
// console.log(StaticAttibution.myName)


/* TS中类的用法 */
// 1. public private 和 protected
// public修饰的属性和方法是共有的，可以在任何地方被访问，默认所有的属性和方法都是public
// private修饰的属性和方法是私有的，不能在声明他的类的外部进行访问
// protected 修饰的属性和方法是受保护的，和private类似，区别是在子类中也是允许访问的
class ParentModifier {
  public publicAttr: string = 'public'
  private privateAttr: string = 'private'
  protected protectedAttr: string = 'protected'
  constructor() {
    console.log(this.privateAttr)
  }
}

class SonModifier extends ParentModifier {
  printExtendsAttr() {
    console.log(this.publicAttr)
    console.log(this.protectedAttr)
    // console.log(this.privateAttr) // 私有属性不可以访问
  }
}

const modifier = new ParentModifier()
console.log(modifier.publicAttr)
// protected受保护的属性或者方法只能在当前类中或者其子类中才能访问
// console.log(modifier.protectedAttr) 



// 2. 参数属性
// 修饰符和readonly还可以使用在构造函数参数中，等于在类中定义该属性同时给属性赋值
class ParamsModifier {
  // 这个写法等同于下面的写法
  public constructor(public name: string) {
  }

  // name: string
  // public constructor(name: string) {
  //   this.name = name
  // }
}
// console.log(new ParamsModifier('isMe').name)


// 3. readonly
// 只读属性关键字，只允许出现在属性声明/索引签名/构造函数中
class ReadonlyModifier {
  public constructor(private readonly name: string) {

  }
  setName() {
    // 报错，不可以设置，只能读取
    // this.name = 'wangshicheng'
  }

  // 我的name属性是私有的，外部不可以直接，因此需要通过一个共有的方法去暴露这个name属性的值
  getName() {
    return this.name
  }
}

// console.log(new ReadonlyModifier('isYouName').getName())
