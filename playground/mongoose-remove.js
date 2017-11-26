
      const {mongoose} = require('./../server/db/mongoose');
      const {Todo} = require('./../server/models/todo');
      const {User} = require('./../server/models/user');
      const {ObjectID} = require('mongodb');

      // You wont get the doc back to print to screen
      // Todo.remove({}).then((result) => {
      //   console.log(result);
      // })

      // You will get the doc back to print to screen
      // Todo.findOneAndRemove()
      // Todo.findByIdAndRemove()
      Todo.findByIdAndRemove('5a1a07526ed184e15e9c18ab').then((todo) => {
        console.log({todo})
      })
