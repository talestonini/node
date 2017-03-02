let add = (a, b) => a + b;

let asyncAdd = (a, b, callback) => {
  setTimeout(() => {
    callback(a + b);
  }, 1000);
};

let square = (x) => x * x;

let asyncSquare = (x, callback) => {
  setTimeout(() => {
    callback(square(x));
  }, 1000);
};

let setName = (user, fullName) => {
  let names = fullName.split(' ');
  user.firstName = names[0];
  user.lastName = names[1];
  return user;
};

module.exports = {
  add,
  asyncAdd,
  square,
  asyncSquare,
  setName
};
