
    const mongoose = require('mongoose');
    const validator = require('validator');
    const jwt = require('jsonwebtoken');
    const _ = require('lodash');
    const bcrypt = require('bcryptjs');
    const secret = process.env.JWT_SECRET;


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
      var token = jwt.sign({_id: user._id.toHexString(), access}, secret).toString()

      user.tokens.push({access, token})

    return user.save().then(() => {
        return token;
      })
    }

    UserSchema.methods.removeToken = function(token) {
      var user = this;
      return user.update({
        $pull: {
          tokens: {
            token
          }
        }
      })
    };

    // statics makes it a model method instead of an instance method
    // instant methods get called with the individual doc
    // model methods get called with the model as the this binding
    UserSchema.statics.findByToken = function (token) {
      var User = this;
      var decoded;

      try{
        decoded = jwt.verify(token, secret)
      } catch (e) {
        // return new Promise((resolve, reject) => {
        //   reject();
        // })

        return Promise.reject()
      }

      return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
      });
    };

    UserSchema.statics.findByCredentials = function(email, password) {
      var User = this;
      return User.findOne({email}).then((user) => {
        if(!user){
          return Promise.reject();
        }
        return new Promise((resolve, reject) => {
          bcrypt.compare(password, user.password, (err, result) => {
            if(result){
              resolve(user)
            }else {
              reject()
            }

          })
        })

      })
    };

    // have to provide next to move on to next function
    UserSchema.pre('save', function(next) {
      var user = this;

      // checks to see if password is modified
      //only should encrypt password if it is modified
      if(user.isModified('password')) {
        var password = user.password;
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if(hash){
              user.password = hash;
              next();
            }
          })
        })
      } else {
        next();
      }
    })

    const User = mongoose.model('User', UserSchema);

    module.exports = {User}
