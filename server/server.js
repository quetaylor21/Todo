
    const express = require('express');
    const bodyParser = require('body-parser')

    const {mongoose} = require('./db/mongoose');
    var {Todo} = require('./models/todo');
    var {User} = require('./models/user');

    var app = express();

    app.use(bodyParser.json());

    //url and callback
    app.post('/todos', (req, res) => {
      console.log(req.body);
      var todo = new Todo({
        text: req.body.text
      });

      todo.save().then((doc) => {
        res.send(doc);
        console.log('todo was created');
        console.log(doc);
      }, (e) => {
        res.status(400).send(e)
        // console.log(e);
      })
    });



    app.listen(8060, () => {
      console.log('Sarted on port 8060')
    });
