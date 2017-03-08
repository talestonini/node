let merge = require('merge');

let objA = {
  a: 10,
  b: 5
};

let objB = {
  a: 7,
  c: 3
};

objA = merge(objA, objB);
console.log(objA);

// objC = merge({ d: 8 });
// console.log(objC);