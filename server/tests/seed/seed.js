
    const {ObjectID} = require('mongodb');
    const {Todo} = require('./../../models/todo');
    const {User} = require('./../../models/user');
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET;

    const userOneId = new ObjectID();
    const userTwoId = new ObjectID();
    const users = [{
      _id: userOneId,
      email: 'user1@gmail.com',
      password: 'userOnePass',
      tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, secret).toString()
      }]
    }, {
      _id: userTwoId,
      email: 'user2@gmail.com',
      password: 'userTwoPass',
      tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, secret).toString()
      }]
    }]

    const todosList = [{
      _id: new ObjectID(),
      text: 'test todo 1',
      owner: users[0]._id
    }, {
      _id: new ObjectID(),
      text: 'test todo two',
      completed: true,
      completedAt: 333,
      owner: users[1]._id
    }]

    // lets you run some code before every test
    //testing lifecycle method
    //using to setup database
  const populateTodos = (done) => {
      Todo.remove({}).then(() => {
        Todo.insertMany(todosList);
      }).then(() => done());
    };

    const populateUsers = (done) => {
      User.remove({}).then(() => {
        var user1 = new User(users[0]).save();
        var user2 = new User(users[1]).save();

        //takes an array of promises and only gets callback when all actions
        // are complete
        Promise.all([user1, user2]);
      }).then(() => {
        done();
      })
    }

module.exports = {
  todosList,
  populateTodos,
  users,
  populateUsers

}
