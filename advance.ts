/*
 * @Author: wangshicheng
 * @Date: 2021-09-26 23:10:32
 * @Description: TS高阶使用学习
 * @FilePath: /learn-ts/advance.ts
 */

/* Partial<Type>: 可选 */
// 作用: 返回一个新类型，这个新类型和目标类型T拥有相同的属性，但是所有的属性都是可选的
// 场景：需要对一个数据对象做整体或者局部更新的需求，可以用到Partial<Type>
type MyPartial<T> = {
  [P in keyof T]?: T[P]
}

// in关键字可以按照js中的for..in循环去理解

interface Person {
  name: string;
  age: number;
}



// 可以看出类型a和类型b是等价的，说明keyof关键字的作用就是后去类型获取是接口的所有key的一个联合类型
type a = keyof Person 
type b = 'name' | 'age'
// const array: b = 'age'
const array: key11 = 'age'
const c: a = array as b

// 将Person类型中所有属性变成可选的， 并且返回一个新类型
type MyPerson = MyPartial<Person>

const person: MyPerson = {
  name: 'name',
  age: 10
}

// typeof关键字获取person实例对象的类型也就是Person类型，然后获取Person类型的key组成的联合类型
type key11 = keyof typeof person


/* Required<Type>: 必要的 */
// 作用：把类型T中的所有属性都转化为可选属性
// 使用：
type MyRequired<T> = {
  // P中的属性会保留其自身在T中的可选性。也就是说如果T之前是可选的，现在就是可选的，
  // 反之，之前是必选的，现在也是必选的，类似于继承的效果
  [P in keyof T]-?: T[P] // -? 的作用就是清楚可选性的用于实现required
}

interface Person2 {
  name?: string;
  age?: number
}

type required = MyRequired<Person2>

const person2: required = {
  name: 'name',
  age: 18
}

// 如果只是想将T类型中的某一些属性转化为必选的，应该怎么做
interface Props {
  a?: string;
  b?: string;
  c?: string;
}

// 新类型中只有属性 a 和 b，并且都改成必选参数
type Props1 = Required<Pick<Props, 'a' | 'b'>>

const props: Props1 = {
  a: 'name',
  b: 'name'
  // c: 'name'
}

// 保留props的所有属性，只是将 a 和 b属性变成必选参数
// 取& 表示存在必选则约束属性为必选，没有必选就是可选属性
type Props2 = Partial<Props> & Required<MyPick<Props, keyof typeof props>>

const props2: Props2 = {
  a: 'name',
  b: 'name',
  c: 'name',
}


// pick 中含有两个类型 T， U被T的key的联合类型进行约束
// Pick<Type, kyes>: keys是字符串或者是字符串并集
// U extends keyof T： 表示U类型需要是 keyof T 类型的子集
// 泛型中使用extends和接口或者class中的继承不是一个意思，泛型中extends表示针对 U类型的一个【类型约束】，和继承没有半毛钱关系
type MyPick<T, U extends keyof T> = {
  // P in U ，U类型是一个联合类型， P属性在联合类型U之中
  [P in U]: T[U]
}


/* Record<keys, Type> */
// 作用：该工具类型会构造一个类型，这个类型的键的类型keys， 值的类型是Type
// keyof any等价于 string | number | symbol 类型的集合
type MyRecord<T extends keyof any, P> = {
  [U in T]: P
}

type m = string | number | symbol
// n类型是等价于 m类型的
type n = keyof any

// 限定键和值的类型都是string
type Obj1 = Record<string, string>
let obj1: Obj1 = {
  name: 'name',
}

type FruitsType = 'apple' | 'banana' | 'pear'
interface FruitInfo {
  name: FruitsType;
  price: number;
}

// 这里Partial将Record中的所有的key都变成了可选的键
type Fruits = Partial<Record<FruitsType, FruitInfo>>
type MyFruits = Required<Record<FruitsType, FruitInfo>>
let fruits: Fruits = {
  'apple': {
    name: 'apple',
    price: 130,
  }
}

/* Omit<Type, Keys>: 表示忽略某些属性 */
// 作用： 构造一个类型，这个类型包含类型Type中除了Keys之外的其余属性，Keys是一个字符串后者字符串并集
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
type MyExclude<T, U> = T extends U ? never : T // 选出T中那些不包含在U中的属性，然后在使用Pick，就实现了Omit



// 实现一个工具类型： SelectRequired<T, K in keyof T>
// type SelectRequired<T, K in keyof T> = Omit<T, K>
type SelectRequired<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>

interface SelectProps {
  a?: string
  b?: string
  c?: string
  d: string
}

type NewProps = SelectRequired<SelectProps, 'b' | 'c'>

const newProps: NewProps = {
  // a: "name",
  b: 'name',
  c: 'name',
  d: 'name'
}

/* ReadOnly<Type>: 只读 */
// 作用： 将类型T中包含属性设置为readonly， 并且返回一个新类型
// 注意在泛型的位置我们一般使用extends进行约束泛型类型 或者keyof这种，不能使用in关键字吧
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface Person {
  name: string
  age: number
}

const person10: MyReadonly<Person> = {
  name: 'lpp',
  age: 18
}

// person10.age = 20;    // 无法分配到 "age" ，因为它是只读属性。ts(2540)