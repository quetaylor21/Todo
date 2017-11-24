
  const mongoose = require('mongoose');

  // let mongoose know you want to us promises instead of callbacks
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost:27017/TodoApp');

  module.exports = {
    mongoose
  }
