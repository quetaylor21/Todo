    require('./config/config')
    const express = require('express');
    const bodyParser = require('body-parser')
    const _ = require('lodash');

    var {mongoose} = require('./db/mongoose');
    var {ObjectID} = require('mongodb');
    var {Todo} = require('./models/todo');
    var {User} = require('./models/user');
    var {authenticate} = require('./middleware/authenticate');

    var app = express();
    const port = process.env.PORT;

    app.use(bodyParser.json());

    //url and callback
    app.post('/todos', authenticate, (req, res) => {
      // console.log(req.body);
      var todo = new Todo({
        text: req.body.text,
        owner: req.user._id
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


    app.get('/todos', authenticate,(req, res) => {
      Todo.find({owner: req.user._id}).then((todos) => {
        // passing data back in object so you can add other props if needed
        res.send({todos})
      }, (err) => {
        res.status(400).send(err)
      })
    })

    // the colin is setting the ID variable to use in the query
    app.get('/todos/:id', authenticate, (req, res) => {
      var id = req.params.id;
      if(!ObjectID.isValid(id)){
        return res.status(404).send();
      }
      Todo.findOne({_id: id, owner: req.user._id}).then((todo) => {
        if(!todo){
          return res.status(404).send()
        }
        res.send({todo})
      }).catch((err) => {
        console.log(err)
        res.status(400).send()
      })
    })

    app.delete('/todos/:id', authenticate, (req, res) => {
      var id = req.params.id;
      if(!ObjectID.isValid(id)){
        return res.status(404).send();
      }
      Todo.findOneAndRemove({_id:id, owner:req.user._id}).then((todo) => {
        if(!todo){
          return res.status(404).send()
        }
        res.send({todo})
      }).catch((err) => {
        console.log(err)
        res.status(400).send()
      })
    })

    app.patch('/todos/:id', authenticate, (req, res) => {
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

      Todo.findOneAndUpdate({
        _id: id, owner:req.user._id}, {$set: body}, {new:true})
        .then((todo) => {
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

      }).then((token) => {
        res.header('x-auth', token).send(user)
      }).catch((e) => {
        res.status(400).send(e)
      })
    })

    // first private route
    app.get('/users/me', authenticate, (req, res) => {
      res.send(req.user)
    })


    app.post('/users/login', (req, res) => {
      var body = _.pick(req.body, ['email', 'password'])

      User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
          res.header('x-auth', token).send(user);
        });
      }).catch((e) => {
        res.status(400).send(e)
      })

    });

    app.delete('/users/me/token', authenticate, (req, res) => {
      req.user.removeToken(req.token).then(() => {
        res.status(200).send()
      }, (err) => {
        res.status(400).send(err)
      })
    })

    module.exports = {app}

    app.listen(8060, () => {
      console.log(`Started on port ${port}`)
    });
