let express = require('express');
let bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.status(201).send(doc);
  }, (e) => {
    console.log(e);
    res.status(400).send(e);
  });
});

const SERVER_PORT = process.env.PORT || 3000;
app.listen(SERVER_PORT, () => {
  console.log(`Started on port ${SERVER_PORT}`)
});
