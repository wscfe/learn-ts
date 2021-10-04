/*
 * @Author: wangshicheng
 * @Date: 2021-10-03 12:48:55
 * @Description: TS中级挑战
 * @FilePath: /ts-expression/medium-challenge.ts
 */

/* get return type: 获取函数的返回值类型 */
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : T

const testFunc = (name: string, age: number): {
  name: string,
  age: number
} => {
  return {
    name,
    age
  }
}
type TestFuncParamsType = MyReturnType<typeof testFunc>

/* Omit： 从一个类型中删除指定的某些类型 */
// 思路：想要从一个接口类型中删除指定属性，需要获取类型中所有的key，然后删除不需要的key，最后从接口中pick出生于的key即可
type MyOmit2<T, K> = Pick< T, Exclude<keyof T, K>>
type TestOmit = MyOmit2<{name: string, age: number}, 'name'>


/* readonly： 可以将某些属性指定为只读属性，不指定则全部属性都设置为可读 */
// 当前类型定义了两个泛型参数，第二个参数如果不传取一个参数的所有的key
// 当前定义的类型是新声明的类型，和之前的没有关系，可以继续使用
type MyReadonly3<T, U extends keyof T = keyof T> = {
  readonly[K in U]: T[K] // 首先将指定的属性设置为只读
} & Omit<T, U> // 然后从原先T类型中删除已经指定为只读的属性，和已经设置为只读的属性进行合并即可

const testMyReadonly2: MyReadonly3<{name: string, age: number, height: number}, 'height' | 'age' | 'name'> = {
  name: 'name',
  age: 10,
  height: 100,
}

// 根据第二个参数将指定属性设置为只读，不能重新进行赋值操作
// testMyReadonly2.name = 'anme' // Cannot assign to 'name' because it is a read-only property


/* DeepReadonly: 递归将一个嵌套类型的所有属性设置成为只读 */
// 不太了解在类型中是否也是存在类型的引用关系？
type DeepReadonly<T> = {
  readonly[K in keyof T]: T[K] extends object 
  ? (T[K] extends Function ? T[K] : DeepReadonly<T[K]>) 
  : T[K]
}


/* 元组转化为联合类型 */
type TupleToUnion<T extends unknown[]> = T[number]
const testTupleToUnion: TupleToUnion<[string | number]> = 'string'


type Chainable<T = {}> = {
  option: <K extends string, V>(key: K, value: V) => Chainable<T & {[key in K]: V}> // 为什么需要使用： 【key in K】?
  get(): T
}

declare const ChainableValue: Chainable


const result = ChainableValue
  .option('foo', 123)
  .option('bar', { value: 'Hello World' })
  .option('name', 'type-challenges')
  .get()

type ChainableType = typeof result
// const testChainable: ChainableType = {

// }

/* last of array: 获取元组中最后一个类型 */
// Tuple members must all have names or all not have names: 针对元组类型，所有的成员要么都存在名称，要么都没有使用infer来进行推断
type Last<T extends any[]> = T extends [...params: any[], lastParams: infer R] ? R : T

type ArrayLast = Last<[string, number, boolean]>
const testTupleLast: ArrayLast = false




/* pop of array: 删除元组类型中最后一个类型 */
type Pop<T extends any[]> = T extends [...params: infer P, popParams: unknown] ? P : T
const testPop: Pop<[string, number, boolean]> = ['name', 18] // 删除最后一个类型



/* 获取Promise.all中全部的promise中的resolve的结果类型集合 */
// 'readonly' type modifier is only permitted on array and tuple literal types
// 表示readonly这个类型修饰符只能作用在数组上面或者 是元组的字面量类型
declare function PromiseAll<T extends any[]>(values: readonly [...T]):
Promise<
{
  -readonly[K in keyof T]: 
  T[K] extends Promise<infer P> ? P: T[K]
}
>

/* Type Lookup： 类型查找 */
// 联合类型的条件判断可以分发处理，通过这种方式去解决问题，
// 现针对外面的联合类型进行拆分，然后在拆分内部的联合类型
// 获取一个接口中的某个属性的类型： 如果不能拿到属性名称去获取，可以使用 U[keyof U]的形式获取
type LookUp<U, T> = U extends (T extends U[keyof U] ? U : never) ? U : never


/* 除去字符串类型左边的空格 */
// 可以使用模版字符串解决
// 空格 或者 换行 或者 制表符
type TrimLeft<S extends string> = S extends `${' ' | '\n' | '\t'}${infer R}` ? TrimLeft<R> : S
// const name11: "    string"  ="string" // error
// const name22: TrimLeft<"    string"> = 'string' // success

/* 除去字符串类型两边的空格 */
type Trim<S extends string> = S extends `${' ' | '\n' | '\t'}${infer R}` | `${infer R}${' ' | '\n' | '\t'}` ? Trim<R> : S


/* Capitalize: 将字符串类型的首字母大写 */
type MyCapitalize<S extends string> = S extends `${infer L}${infer R}` ? `${Uppercase<L>}${R}` : S
type Cap = MyCapitalize<'my name'>

// Uppercase可以将一个小写字母转换为大写字母，空字符串和数字保持不变
type Upper = Uppercase<"a">


/* 替换字符串类型中符合条件的字符 */
// 替换所有的【注意空字符串不进行替换】
type ReplaceAll<S extends string, From extends string, To extends string> = 
S extends `${infer L}${From}${infer R}` 
  ? (From extends '' 
    ? `${L}${From}${R}` 
    // 二分法的思想，分别处理两边的字符串，加上刚刚替换的To字符串，最后加上右边的字符串
    : `${ReplaceAll<`${L}`, From, To>}${To}${ReplaceAll<`${R}`, From, To>}`)
  : S


// 替换符合条件的
// 空字符串不替换
type Replace<S extends string, From extends string, To extends string> = 
S extends `${infer L}${From}${infer R}` 
? ( From extends '' 
  ? `${L}${From}${R}` 
  : `${L}${To}${R}`) 
: S


type TestReplace = ReplaceAll<'foobarfoobar', 'ob', 'b'> // fbarfbar ==> fobarfobar



// 后面继续关注
// 针对数据的合并使用扩展运算符
type AppendArgument<Fn extends Function, A extends any> = Fn extends (...args: infer P) => infer R ? (...args: [...P, A]) => R : Fn

// 都是形式参数， 参数名称不一致感觉也可以接受
// 但是为什么没有针对函数的返回结果做类型推断就不行呢？？ 
// 因为给出的函数类型是带返回值的，所有需要类型推论获取函数的返回之类类型， 同时我们只是接受一个函数类型【Function】，不知道这个函数会传什么样的参数，以及多少个参数，只能使用类型推论来解决
type Case1 = AppendArgument<(a: number, b: string) => number, boolean>