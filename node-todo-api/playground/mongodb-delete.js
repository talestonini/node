// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // delete many
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // delete one
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // find one and delete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(JSON.stringify(result, undefined, 2));
  // });

  db.collection('Users').deleteMany({ name: 'Tales' }).then((res) => {
    if (res.result.ok === 1 && res.result.n > 0) {
      console.log(`Successfully deleted ${res.result.n} document(s)`);
    } else {
      console.log('Unable to delete many :(');
    }
  });

  db.collection('Users').deleteOne({ _id: new ObjectID('58b8b882c9a2f544ba66398f') }).then((res) => {
    if (res.result.ok === 1 && res.result.n > 0) {
      console.log(`Successfully deleted ${res.result.n} document`);
    } else {
      console.log('Unable to delete one :(');
    }
  });

  db.close();
});
