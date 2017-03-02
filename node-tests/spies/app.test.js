const expect = require('expect');
const rewire = require('rewire');

var app = rewire('./app');

describe('App', () => {
  var dbMock = {
    saveUser: expect.createSpy()
  };
  app.__set__('db', dbMock);

  it('should call the spy correctly', () => {
    var spy = expect.createSpy();
    
    spy('Tales', 35);

    expect(spy).toHaveBeenCalledWith('Tales', 35);
  });

  it('should call saveUser with user object', () => {
    var email = 'talestonini@gmail.com';
    var password = '123abc';

    app.handleSignup(email, password);

    expect(dbMock.saveUser).toHaveBeenCalledWith({ email, password });
  });

});
