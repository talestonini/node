// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  db.collection('Users').find({ name: 'Tales' }).toArray().then((users) => {
    console.log('Users');
    console.log(JSON.stringify(users, undefined, 2));
    console.log(`${users.length} document(s) returned`);
  }, (err) => {    
    console.log('Unable to fetch users', err);
  });

  db.close();
});
