require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

let app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  new Todo(_.pick(req.body, ['text']))
    .save()
    .then((todo) => res.status(201).send(todo))
    .catch((e) => res.status(400).send(e));
});

app.get('/todos', (req, res) => {
  Todo.find()
    .then((todos) => res.send({ todos }))
    .catch((e) => res.status(400).send(e));
});

app.get('/todos/:id', (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch((e) => res.status(400).send(e));
});

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch((e) => res.status(400).send(e));
});

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  let body = _.pick(req.body, ['text', 'completed']);

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch((e) => res.status(400).send(e));
});

app.post('/users', (req, res) => {
  let user = new User(_.pick(req.body, ['email', 'password']))
  user
    .save()
    .then(() => user.generateAuthToken())
    .then((token) => res.header('x-auth', token).status(201).send(user))
    .catch((e) => res.status(400).send(e));
});

app.listen(process.env.PORT, () => {
  console.log(`Started on port ${process.env.PORT}`)
});

module.exports = {
  app
}
