const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');

describe('todos endpoints', () => {

  let todoStubs = [
    { text: 'Feed the dog' },
    { text: 'Feed the cat', completed: true, completedAt: 123 }
  ];

  beforeEach((done) => {
    Todo.remove({})
      .then(() => Todo.insertMany(todoStubs).then((todos) => todoStubs = todos))
      .then(() => done());
  });

  describe('POST /todos', () => {
    it('should create a new todo', (done) => {
      let text = 'Test todo text';

      request(app)
        .post('/todos')
        .send({ text })
        .expect(201)
        .expect((res) => {
          expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Todo.find({ text })
            .then((todos) => {
              expect(todos.length).toBe(1);
              expect(todos[0].text).toBe(text);
              done();
            })
            .catch((e) => done(e));
        });
    });

    it('should not create todo with invalid body data', (done) => {
      request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Todo.find()
            .then((todos) => {
              expect(todos.length).toBe(todoStubs.length);
              done();
            })
            .catch((e) => done(e));
        });
    });
  });

  describe('GET /todos', () => {
    it('should get all todos', (done) => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body.todos.length).toBe(todoStubs.length);
        })
        .end(done);
    });
  });

  describe('GET /todos/:id', () => {
    it('should get a todo by id', (done) => {
      let _id = todoStubs[1]._id.toHexString();
      request(app)
        .get(`/todos/${_id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(_id);
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
      request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
      request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo by id', (done) => {
      let _id = todoStubs[1]._id.toHexString();
      request(app)
        .delete(`/todos/${_id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(_id);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Todo.findById(_id)
            .then((todo) => {
              expect(todo).toNotExist();
              done();
            })
            .catch((e) => done(e));
        });
    });

    it('should return 404 if todo not found', (done) => {
      request(app)
        .delete(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
      request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done);
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should update a todo by id', (done) => {
      let _id = todoStubs[0]._id.toHexString();
      let text = 'Feed the dog and the kangaroo';
      request(app)
        .patch(`/todos/${_id}`)
        .send({ text, completed: true, completedAt: 456 })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(true);
          expect(res.body.todo.completedAt).toBeA('number').toNotBe(456);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Todo.findById(_id)
            .then((todo) => {
              expect(todo.text).toBe(text);
              expect(todo.completed).toBe(true);
              expect(res.body.todo.completedAt).toBeA('number').toNotBe(456);
              done();
            })
            .catch((e) => done(e));
        });
    });

    it('should clear completedAt when todo is not completed', (done) => {
      let _id = todoStubs[1]._id.toHexString();
      let text = 'Feed the cat and the kangaroo';
      request(app)
        .patch(`/todos/${_id}`)
        .send({ text, completed: false, completedAt: 456 })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toNotExist();
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Todo.findById(_id)
            .then((todo) => {
              expect(res.body.todo.text).toBe(text);
              expect(res.body.todo.completed).toBe(false);
              expect(res.body.todo.completedAt).toNotExist();
              done();
            })
            .catch((e) => done(e));
        });
    });

    it('should return 404 if todo not found', (done) => {
      request(app)
        .patch(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
      request(app)
        .patch('/todos/123')
        .expect(404)
        .end(done);
    });
  });

});

describe('users endpoints', () => {

  let userStubs = [
    { email: 'lucy@skywithdiamonds.com', password: 'lucyDiamond' },
    { email: 'majortom@groundcontrol.com', password: 'majorTom' },
  ];

  beforeEach((done) => {
    User.remove({})
      .then(() => User.insertMany(userStubs).then((users) => userStubs = users))
      .then(() => done());
  });

  describe('POST /users', () => {
    let email = 'talestonini@gmail.com';
    let password = 'blahblah123';

    it('should create a new user', (done) => {
      request(app)
        .post('/users')
        .send({ email, password })
        .expect(201)
        .expect((res) => {
          expect(res.body.email).toBe(email);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          User.find({ email })
            .then((users) => {
              expect(users.length).toBe(1);
              expect(users[0].email).toBe(email);
              expect(users[0].password).toBe(password);
              done();
            })
            .catch((e) => done(e));
        });
    });

    it('should not create user missing email', (done) => {
      request(app)
        .post('/users')
        .send({ password })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          User.find()
            .then((users) => {
              expect(users.length).toBe(userStubs.length);
              done();
            })
            .catch((e) => done(e));
        });
    });

    it('should not create user with duplicate email', (done) => {
      request(app)
        .post('/users')
        .send({ email: 'lucy@skywithdiamonds.com', password })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          User.find()
            .then((users) => {
              expect(users.length).toBe(userStubs.length);
              done();
            })
            .catch((e) => done(e));
        });
    });

    it('should not create user with invalid email', (done) => {
      request(app)
        .post('/users')
        .send({ email: 'lucy@', password })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          User.find()
            .then((users) => {
              expect(users.length).toBe(userStubs.length);
              done();
            })
            .catch((e) => done(e));
        });
    });

    it('should not create user missing password', (done) => {
      request(app)
        .post('/users')
        .send({ email })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          User.find()
            .then((users) => {
              expect(users.length).toBe(userStubs.length);
              done();
            })
            .catch((e) => done(e));
        });
    });

    it('should not create user password too short', (done) => {
      request(app)
        .post('/users')
        .send({ email, password: 'abc12' })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          User.find()
            .then((users) => {
              expect(users.length).toBe(userStubs.length);
              done();
            })
            .catch((e) => done(e));
        });
    });
  });

});