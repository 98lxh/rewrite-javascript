import _Promise from "../src"

describe("promise static methods", () => {
  test("resolve", () => {
    _Promise.resolve(111).then(res => {
      expect(res).toBe(111)
    })
  })

  test("reject", () => {
    _Promise.reject(111).catch(err => {
      expect(err).toBe(111)
    })
  })

  test("all", (done) => {
    //一个promise状态为error 则进入catch逻辑
    const p1 = new _Promise(resolve => {
      setTimeout(() => {
        resolve(111)
      }, 100)
    })
    const p2 = new _Promise(resolve => {
      setTimeout(() => {
        resolve(222)
      }, 200)
    })
    const p3 = new _Promise(resolve => {
      setTimeout(() => {
        resolve(333)
      }, 300)
    })

    const p4 = new _Promise((_, reject) => {
      setTimeout(() => {
        reject(333)
      }, 1000)
    })

    //resolve
    _Promise.all([p1, p2, p3]).then(res => {
      expect(res).toStrictEqual([111, 222, 333])
    })

    //reject
    _Promise.all([p1, p2, p4]).catch(err => {
      expect(err).toStrictEqual(333)
      done()
    })
  })


  test("allSettled", (done) => {
    //一个promise状态为error 则进入catch逻辑
    const p1 = new _Promise(resolve => {
      setTimeout(() => {
        resolve(111)
      }, 100)
    })
    const p2 = new _Promise(resolve => {
      setTimeout(() => {
        resolve(222)
      }, 200)
    })
    const p3 = new _Promise(resolve => {
      setTimeout(() => {
        resolve(333)
      }, 300)
    })
    const p4 = new _Promise((_, reject) => {
      setTimeout(() => {
        reject(333)
      }, 1000)
    })

    //resolve
    _Promise.allSettled([p1, p2, p3]).then(res => {
      expect(res).toStrictEqual([
        { status: 'fulfilled', value: 111 },
        { status: 'fulfilled', value: 222 },
        { status: 'fulfilled', value: 333 }
      ])
    })

    _Promise.allSettled([p1, p2, p4]).then(res => {
      expect(res).toStrictEqual([
        { status: 'fulfilled', value: 111 },
        { status: 'fulfilled', value: 222 },
        { status: 'rejected', value: 333 }
      ])
      done()
    })
  })


  test("reac", (done) => {
    //一个promise状态为error 则进入catch逻辑
    const p1 = new _Promise(resolve => {
      setTimeout(() => {
        resolve(111)
      }, 100)
    })
    const p2 = new _Promise(resolve => {
      setTimeout(() => {
        resolve(222)
      }, 200)
    })
    const p3 = new _Promise(resolve => {
      setTimeout(() => {
        resolve(333)
      }, 300)
    })
    const e1 = new _Promise((_, reject) => {
      setTimeout(() => {
        reject('err')
      }, 50)
    })

    _Promise.rece([p1, p2, p3]).then(res => {
      expect(res).toBe(111)
    })

    _Promise.rece([e1, p2, p3]).catch(err => {
      expect(err).toBe('err')
      done()
    })
  })

  test("any", (done) => {
    //一个promise状态为error 则进入catch逻辑
    const p1 = new _Promise(resolve => {
      setTimeout(() => {
        resolve(111)
      }, 100)
    })
    const e1 = new _Promise((_, reject) => {
      setTimeout(() => {
        reject('err1')
      }, 50)
    })

    const e2 = new _Promise((_, reject) => {
      setTimeout(() => {
        reject('err2')
      }, 100)
    })

    const e3 = new _Promise((_, reject) => {
      setTimeout(() => {
        reject('err3')
      }, 150)
    })

    _Promise.any([p1, e2, e3]).then(res => {
      expect(res).toBe(111)
    })

    _Promise.any([e1, e2, e3]).catch(errs => {
      expect(errs).toStrictEqual(['err1', 'err2', 'err3'])
      done()
    })
  })
})
