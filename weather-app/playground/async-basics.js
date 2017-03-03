console.log('starting app...');

setTimeout(() => {
  console.log('inside of callback');
}, 2000);

setTimeout(() => {
  console.log('inside 0-delay');
}, 0);

console.log('finishing app...');