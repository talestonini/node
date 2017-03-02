const express = require('express');

let app = express();

app.get('/', (req, res) => {
  res.status(404).send({
    error: 'Page not found.',
    name: 'Todo App v1.0'
  });
});

app.get('/users', (req, res) => {
  res.status(200).send([
    { name: 'Tales', age: 35 },
    { name: 'Slash', age: 53 }
  ]);
});

app.listen(3000);

module.exports.app = app;
