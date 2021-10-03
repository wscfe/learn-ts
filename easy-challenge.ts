/*
 * @Author: wangshicheng
 * @Date: 2021-10-03 10:08:33
 * @Description: TS类型实现容易挑战题
 * @FilePath: /ts-expression/easy-challenge.ts
 */
/* Pick: 从一个类型中挑选出指定的类型 */
type MyPick<T, P extends keyof T> = {
  [K in P]: T[K]
}


/* 实现Readonly */
type MyReadonly<T> = {
  readonly[K in keyof T]: T[K]
}

/* 实现元组转换成为对象 */
/**
 * 首先针对T类型约束的时候我们使用了（keyof any）就是约束了数组项中必须是number ｜ string | symbol
 * 注意in关键字只能针对联合类型使用，不能直接针对数组或者元组使用
 * 如果需要想将元组或者数组的元素转成联合类型，直接使用 T[number]即可
 */
type TupleToObject<T extends readonly (keyof any)[]> = {
  [P in T[number]]: P
}

/* First of Array： 获取数组类型的第一个元素类型 */
/**
 * 注意在判断是否被never类型约束的时候不能使用T[0]来取数据中的值
 * 使用T[0]说明已经取到第一个值，不论是否存在值，而使用T[number]则不一定能取到第一个值
 */
type First<T extends any[]> = T[number] extends never ? never : T[number]


/* Length of Tuple： 获取元组的长度 */
/**
 * 应该是元组或者数组都存在长度属性，可以直接使用
 */
type Length<T extends unknown[]> = T["length"]


/* 实现Exclude：Exclude from T those types that are assignable to U  */
/**
 * Exclude字面意思就是从T类型中排除可以赋值给U的元素
 */
type MyExclude<T, U> = U extends T ? never : U


/* Awaited： For example if we have `Promise<ExampleType>` how to get ExampleType? */
/**
 * T类型被Promise类型约束，Promise接受一个any类型的参数，
 * 一般获取某个类型中的参数类型的时候，大部分场景下使用extends和infer类型推断一起使用
 */
type Awaited<T extends Promise<unknown>> = T extends Promise<infer P> ? P : T


/* If： 实现类型的条件判断 */
/**
 * 注意在写类型的时候，首先考虑当前类型接受的泛型参数的约束
 */
type If<C extends boolean, L, R> = C extends true ? L : R


/* Concat: 实现两个类型数组的合并 */
/**
 * hahah,可以使用 扩展运算符，香
 */
type Concat<T extends any[], U extends any[]> = [...T, ...U]


/* Includes: 实现数组中的includes方法，判断一个类型是否包含在数组中 */
/**
 * K in T[number]: 表示获取数组T中所有的元素，然后进一步去操作
 * K in keyof T: 表示获取数组T中所有的索引，然后进一步去操作
 */
type Equal<X, Y> = <T>() => T extends X ? 1 : 2 extends <T>() => T extends Y ? 1 : 2 ? true : false

type Includes<T extends readonly any[], U> = {
  [K in keyof T]: Equal<T[K], U> extends true ? true : never
}[number] extends never ? false : true

// 先对数组T进行拆分，然后针对大事化小，小事化无，使用了递归的思想
// 使用infer拆分数组的方式可以学习一下
type Includes2<T extends readonly any[], U> = T extends [infer F, ...infer R] ? F extends U ? true : Includes2<R, U> : false


/* Push： 实现push方法 */
type Push<T extends any[], U> = [...T, U]


/* Unshift: 实现数组的unShift方法 */
type Unshift<T extends any[], U> = [U, ...T]


/* Parameters: 实现内置的Parameters泛型 */
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : T

const func = (name: string, age: number) => {}
type funcParams = MyParameters<typeof func>






/* unknow 与 any类型的区别, 可以在对比一下 never， undefined， null */
/**
 * unknow是Top type ，即任何类型都是unknow的子类型【任何类型都可以赋值给unknow类型的变量】， 任何类型 => unknow
 * any是 Top type（任何类型都是any的子类型），也是bottom type（any是任何类型的子类型），任何类型 <=> any
 * 
 * 如果使用使用断言或者类型的方式去缩小unknow的类型范围，则只能将unknow类型的变量赋值给any或者unknow
 */