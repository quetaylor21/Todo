
    const express = require('express');
    const bodyParser = require('body-parser')

    const {mongoose} = require('./db/mongoose');
    var {Todo} = require('./models/todo');
    var {User} = require('./models/user');

    var app = express();

    app.use(bodyParser.json());

    //url and callback
    app.post('/todos', (req, res) => {
      // console.log(req.body);
      var todo = new Todo({
        text: req.body.text
      });

      todo.save().then((doc) => {
        res.send(doc);
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
    app.listen(8060, () => {
      console.log('Started on port 8060')
    });

    module.exports = {app}
