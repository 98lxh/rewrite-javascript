const enum PROMISE_STATUS {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected'
}

type ResolveFn = (value?) => void
type RejectFn = (reason?) => void

type ExecutorFn = (resolve: ResolveFn, reject: RejectFn) => void

const defaultOnReject = err => { throw err }
const defaultOnFulfilled = value => value

function execFunctionWithCatchError(value, resolve, reject, execuFn) {
  try {
    const result = execuFn(value)
    resolve(result)
  } catch (err) {
    reject(err)
  }
}

export default class _Promise<T = any> {
  private value?: T
  private reason?: T
  private status: PROMISE_STATUS
  private onFulfilledFns: ResolveFn[]
  private onRejectedFns: RejectFn[]
  private valve: boolean = false

  constructor(executor: ExecutorFn) {
    //初始化状态->pending
    this.status = PROMISE_STATUS.PENDING
    //成功的回调函数
    this.onFulfilledFns = []
    //失败的回调
    this.onRejectedFns = []

    const resolve = (value: T) => {
      if (this.status === PROMISE_STATUS.PENDING) {
        //修改状态
        this.status = PROMISE_STATUS.FULFILLED
        this.value = value
        queueMicrotask(() => {
          this.valve = true
          this.onFulfilledFns.forEach(fn => {
            fn(this.value)
          })
        })
      }
    }

    const reject = (reason: T) => {
      if (this.status === PROMISE_STATUS.PENDING) {
        //修改状态
        this.status = PROMISE_STATUS.REJECTED
        this.reason = reason
        queueMicrotask(() => {
          this.valve = true
          this.onRejectedFns.forEach(fn => {
            fn(this.reason)
          })
        })
      }
    }

    //执行器执行
    try {
      executor(resolve, reject)
    } catch (err: any) {
      reject(err)
    }
  }

  static resolve(value?) {
    return new _Promise(resolve => resolve(value))
  }

  static reject(reason?) {
    return new _Promise((_, reject) => reject(reason))
  }

  static all(promises: _Promise[]) {
    return new _Promise((resolve, reject) => {
      const values: any[] = []
      promises.forEach(promise => {
        promise.then(res => {
          values.push(res)
          if (values.length === promises.length) resolve(values)
        }, err => {
          reject(err)
        })
      })
    })
  }

  static allSettled(promises: _Promise[]) {
    return new _Promise(resolve => {
      const results: any[] = []
      promises.forEach(promise => {
        promise.then(res => {
          results.push({ status: PROMISE_STATUS.FULFILLED, value: res })
          if (results.length === promises.length) resolve(results)
        }, err => {
          results.push({ status: PROMISE_STATUS.REJECTED, value: err })
          if (results.length === promises.length) resolve(results)
        })
      })
    })
  }

  static rece(promises: _Promise[]) {
    return new _Promise((resolve, reject) => {
      promises.forEach(promise => {
        const reasons: any[] = []
        promise.then(resolve, (err) => {
          reasons.push(err)
          if (reasons.length === promises.length) {
            //AggregateError(reasons)
            reject(reasons)
          }
        })
      })
    })
  }

  static any(promises: _Promise[]) {
    return new _Promise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(resolve, reject)
      })
    })
  }

  then(onFulfilled?: ResolveFn, onRejected?: RejectFn) {
    onRejected = onRejected || defaultOnReject

    onFulfilled = onFulfilled || defaultOnFulfilled

    return new _Promise((resolve, reject) => {
      //执行then方法的时候 如果状态已经确定下来了 那么可以直接执行传入的回调
      if (this.status === PROMISE_STATUS.FULFILLED && this.valve) {
        onFulfilled && execFunctionWithCatchError(this.value, resolve, reject, onFulfilled)
      }

      if (this.status === PROMISE_STATUS.REJECTED && this.valve) {
        onRejected && execFunctionWithCatchError(this.reason, resolve, reject, onRejected)
      }

      if (!this.valve) {
        onFulfilled && this.onFulfilledFns.push(() => {
          execFunctionWithCatchError(this.value, resolve, reject, onFulfilled)
        })
        onRejected && this.onRejectedFns.push(() => {
          execFunctionWithCatchError(this.reason, resolve, reject, onRejected)
        })
      }
    })
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  finally(onFinally) {
    return this.then(onFinally, onFinally)
  }
}
