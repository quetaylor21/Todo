
      const {mongoose} = require('./../server/db/mongoose');
      const {Todo} = require('./../server/models/todo');
      const {User} = require('./../server/models/user');
      const {ObjectID} = require('mongodb');

      var id = '5a18d4b602bbc01f1e89556c';
      var userId = '5a187edc46514b41855d9ddd'

      // this validates IDs
      if(!ObjectID.isValid(id)){
        console.log('ID not valid');
      }

      // Todo.find({_id: id}).then((doc) => {
      //   console.log(doc);
      // });
      //
      // Todo.findOne({_id: id}).then((doc) => {
      //   console.log('find one ', doc);
      // });

      // Todo.findById(id).then((doc) => {
      //   if(!doc){
      //     return console.log('ID not found');
      //   }
      //   console.log('find by id', doc);
      // }).catch((e) => {
      //   console.log(e);
      // })
      User.findById(userId).then((doc) => {
        if(!doc){
          return console.log('user cant be found by ID');
        }
        console.log('user by ID', doc)
      }, (err) => {
        console.log(err);
      })
