
  const mongoose = require('mongoose');

  // let mongoose know you want to us promises instead of callbacks
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.MONGODB_URI);

  module.exports = {
    mongoose
  }

  // heroku sets this to production by default
  process.env.NODE_ENV
