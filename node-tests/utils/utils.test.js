const expect = require('expect');

const utils = require('./utils')

describe('Utils', () => {

  describe('#add', () => {
    it('should add two numbers', () => {
      // given
      const expectedRes = 44;

      // when
      var res = utils.add(33, 11);

      // then
      // if (res !== expectedRes) {
      //   throw new Error(`Expected ${expectedRes}, but got ${res}`);
      // }
      expect(res).toBeA('number').toBe(expectedRes);
    });
  });

  it('should async add two numbers', (done) => {
    utils.asyncAdd(4, 3, (sum) => {
      expect(sum).toBeA('number').toBe(7);
      done();
    });
  });

  it('should square a number', () => {
    // given
    const expectedRes = 9;

    // when
    var res = utils.square(3);

    // then
    // if (res !== expectedRes) {
    //   throw new Error(`Expected ${expectedRes}, but got ${res}`);
    // }
    expect(res).toBeA('number').toBe(expectedRes);
  });

  it('should async square a number', (farOut) => {
    utils.asyncSquare(4, (square) => {
      expect(square).toBeA('number').toBe(16);
      farOut();
    })
  });

  it('should set first and last names', () => {
    // user
    let user = {
      firstName: 'Tales',
      lastName: 'Tonini',
      age: 35,
      location: 'Melbourne'
    }

    // when
    let res = utils.setName(user, 'Axl Rose');

    // then
    expect(res).toBe(user);
    expect(user).toInclude({ firstName: 'Axl', lastName: 'Rose', age: 35, location: 'Melbourne' });
  });
});

it('should expect some values', () => {
  expect(12).toNotBe(11);
  expect({ name: 'Tales' }).toEqual({ name: 'Tales' });
  expect([2, 3, 4]).toInclude(3);
  expect({
    name: 'Tales',
    age: 35,
    location: 'Melbourne'
  }).toInclude({
    age: 35
  });

});
