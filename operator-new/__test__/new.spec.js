import _new from "./../src/index"

describe('new', () => {
  test('happy path', () => {
    function Student(name, age) {
      this.name = name
      this.age = age
    }

    Student.prototype.say = function () {
      return this.name + this.age
    }

    const s1 = _new(Student, 'name', 18)
    expect(s1.say()).toBe('name18')
    expect(s1.__proto__).toBe(Student.prototype)

    function _Student(name, age) {
      this.name = name
      this.age = age
      return {
        age: 10
      }
    }

    const s2 = _new(_Student, 'name', 18)
    expect(s2.age).toBe(10)
  })
})
