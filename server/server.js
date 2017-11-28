    require('./config/config')
    const express = require('express');
    const bodyParser = require('body-parser')
    const _ = require('lodash');

    const {mongoose} = require('./db/mongoose');
    const {ObjectID} = require('mongodb');
    const {Todo} = require('./models/todo');
    const {User} = require('./models/user');

    var app = express();
    const port = process.env.PORT;

    app.use(bodyParser.json());

    //url and callback
    app.post('/todos', (req, res) => {
      // console.log(req.body);
      var todo = new Todo({
        text: req.body.text
      });

      todo.save().then((todo) => {
        res.send(todo);
        // console.log('todo was created');
        // console.log(doc);
      }, (e) => {
        res.status(400).send(e)
        // console.log(e);
      })
    });


    app.get('/todos', (req, res) => {
      Todo.find().then((todos) => {
        // passing data back in object so you can add other props if needed
        res.send({todos})
      }, (err) => {
        res.status(400).send(err)
      })
    })

    // the colin is setting the ID variable to use in the query
    app.get('/todos/:id', (req, res) => {
      var id = req.params.id;
      if(!ObjectID.isValid(id)){
        return res.status(404).send();
      }
      Todo.findById(id).then((todo) => {
        if(!todo){
          return res.status(404).send()
        }
        res.send({todo})
      }).catch((err) => {
        console.log(err)
        res.status(400).send()
      })
    })

    app.delete('/todos/:id', (req, res) => {
      var id = req.params.id;
      if(!ObjectID.isValid(id)){
        return res.status(404).send();
      }
      Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
          return res.status(404).send()
        }
        res.send({todo})
      }).catch((err) => {
        console.log(err)
        res.status(400).send()
      })
    })

    app.patch('/todos/:id', (req, res) => {
      var id = req.params.id;
      var body = _.pick(req.body, ['text', 'completed']);
      if(!ObjectID.isValid(id)){
        return res.status(404).send();
      }

      if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
      }else{
        body.completed = false;
        body.completedAt = null;
      }

      Todo.findByIdAndUpdate(id, {$set: body}, {new:true}).then((todo) => {
        if(!todo){
          return res.status(404).send()
        }
        res.send({todo});
      }).catch((e) => {
        res.status(400).send(e)
      })
    })

    app.post('/users', (req, res) => {
      var body = _.pick(req.body, ['email', 'password']);
      var user = new User(body);

      user.save().then(() => {
          return user.generateAuthToken();
        // res.send(user)
      }).then((token) => {
        res.header('x-auth', token).send(user)
      }).catch((e) => {
        res.status(400).send(e)
      })
    })
    app.listen(8060, () => {
      console.log(`Started on port ${port}`)
    });

    module.exports = {app}
