
    const mongoose = require('mongoose');
    const validator = require('validator');
    const jwt = require('jsonwebtoken');
    const _ = require('lodash');

    // create a schema
    var UserSchema = new mongoose.Schema({
      email: {
        type: String,
        require: true,
        trim: true,
        minlength: 1,
        // make sure email isn't already in use
        unique: true,
        validate: {
          validator: validator.isEmail,
          // validator: (value) => {
          //   return validator.isEmail(value)
          // },
          message: '{VALUE} is not a valid email'
        }
      },
      password: {
        type: String,
        require: true,
        minlength: 6
      },
      tokens: [{
        access: {
          type: String,
          require: true
        },
        token: {
          type: String,
          require: true
        }
      }]
    });

    UserSchema.methods.toJSON = function () {
      var user = this;
      var userObject = user.toObject();

      return _.pick(userObject, ['_id', 'email'])
    }

    UserSchema.methods.generateAuthToken = function () {
      var user = this;
      var access = 'auth';
      var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString()

      user.tokens.push({access, token})

    return user.save().then(() => {
        return token;
      })
    }

    const User = mongoose.model('User', UserSchema)

    module.exports = {User}
