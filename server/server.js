
    const express = require('express');
    const bodyParser = require('body-parser')

    const {mongoose} = require('./db/mongoose');
    const {ObjectID} = require('mongodb');
    var {Todo} = require('./models/todo');
    var {User} = require('./models/user');

    var app = express();
    const port = process.env.PORT || 3000;

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
    app.listen(port, () => {
      console.log(`Started on port ${port}`)
    });

    module.exports = {app}
