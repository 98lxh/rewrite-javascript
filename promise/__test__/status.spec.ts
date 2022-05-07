import _Promise from "../src";

describe("promise status", () => {
  test('the execute resolve state should be changed to resolve', () => {
    const promise = new _Promise((resolve) => {
      resolve('fulfilled')
    })

    expect((promise as any).status).toBe('fulfilled')
    expect((promise as any).value).toBe('fulfilled')
  })

  test('the execute resolve state should be changed to reject', () => {
    const promise = new _Promise((_, reject) => {
      reject('rejected')
    })

    expect((promise as any).status).toBe('rejected')
    expect((promise as any).reason).toBe('rejected')
  })

  test('call both resolve and reject should only be executed once', () => {
    const promise = new _Promise((resolve, reject) => {
      resolve('fulfilled')
      reject('rejected')
    })

    expect((promise as any).status).toBe('fulfilled')
    expect((promise as any).value).toBe('fulfilled')
  })
})
