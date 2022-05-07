import exp from "constants"
import _Promise from "../src"

describe("promise instance method then", () => {

  test('call then', (done) => {
    const promise = new _Promise((resolve) => {
      resolve(111)
    })

    promise.then((res) => {
      expect(res).toBe(111)
      done()
    })
  })

  test('call chaining then', (done) => {
    new _Promise((resolve) => {
      resolve(111)
    }).then((res) => {
      expect(res).toBe(111)
    })

    new _Promise((_, reject) => {
      reject('err')
    }).then((res) => {
    }, (err) => {
      expect(err).toBe('err')
      done()
    })
  })

  test('multiple chianing calls then', (done) => {
    const promise1 = new _Promise((resolve) => {
      setTimeout(() => {
        resolve(1111)
      }, 1000)
    })

    promise1.then(res => {
      expect(res).toBe(1111)
      return res * 2
    }).then(res => {
      expect(res).toBe(2222)
    })

    const promise2 = new _Promise((resolve) => {
      setTimeout(() => {
        resolve(1111)
      }, 1000)
    })

    promise2.then(() => {
      throw Error('error message')
    }).then(undefined, (err) => {
      const count = 0
      expect(count).toBe(0)
      done()
    })
  })

  test('timeout call then', (done) => {
    let count = 0;
    const promise = new _Promise(resolve => {
      resolve(111)
    })

    promise.then(res => {
      count++
    })

    setTimeout(() => {
      promise.then(res => {
        count++
        expect(res).toBe(111)
        expect(count).toBe(2)
        done()
      })
    }, 1000)
  })


  test('catch', () => {
    const promise = new _Promise((_, reject) => {
      reject('error')
    })

    promise.then(res => {
      console.log(res)
    }).catch(err => {
      expect(err).toBe('error')
    })
  })

  test('finally', (done) => {
    const onFinally = jest.fn(() => { })
    const promise = new _Promise((resolve, reject) => {
      resolve(1111)
    })

    promise.then((res) => {
      return res * 2
    }).catch(err => {
      expect(err).toBe(1111)
    }).finally(onFinally)

    setTimeout(() => {
      expect(onFinally).toBeCalledTimes(1)
      done()
    })
  })
})
