//1.创建一个新对象
//2.设置原型，将对象的原型设置为构造函数的prototype
//3让构造俺叔的this指向这个函数 执行构造函数的代码
//4.判断返回值的类型，如果手动返回了一个引用类型就返回这个引用类型否则返回创建的新对象


export default function _new(ctor, ...args) {
  if (typeof ctor !== 'function') {
    return new Error('ctor must be a function')
  }
  const obj = Object.create(ctor.prototype)
  let result = ctor.call(obj, ...args)
  let isObject = typeof result === 'object' && typeof result !== null
  let isFunction = typeof result === 'function'
  return isObject || isFunction ? result : obj
}
