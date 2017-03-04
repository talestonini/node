let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp';
mongoose.connect(DB_URI);

module.exports = {
  mongoose
}