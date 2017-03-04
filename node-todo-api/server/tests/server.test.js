const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

let stubs = [
  { text: 'Feed the dog' },
  { text: 'Feed the cat', completed: true, completedAt: 123 }
];

beforeEach((done) => {
  Todo.remove({})
    .then(() => Todo.insertMany(stubs).then((todos) => stubs = todos))
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
            expect(todos.length).toBe(stubs.length);
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
        expect(res.body.todos.length).toBe(stubs.length);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should get a todo by id', (done) => {
    let _id = stubs[1]._id.toHexString();
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
    let _id = stubs[1]._id.toHexString();
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
    let _id = stubs[0]._id.toHexString();
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
    let _id = stubs[1]._id.toHexString();
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
