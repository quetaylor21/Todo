
    const {MongoClient, ObjectID} = require('mongodb');

    MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
      if(err){
        return console.log('Unable to connect to MongoDb server')
      }
      console.log('Connected to MongoDb server')
      // db.collection('Todos').insert({test: 'Keep working again', completed: true}).then((docs) => {
      //   console.log('todo inserted')
      //   console.log(JSON.stringify(docs, undefined, 2))
      // }, (err) => {
      //   console.log('Couldn\'t insert new todo', err)
      // })

      // db.collection('Todos').find({completed: true}).toArray().then((docs) => {
      //   console.log('Todos')
      //   console.log(JSON.stringify(docs, undefined, 2))
      // }, (err) => {
      //   cosnole.log('Unable to fetch todos', err)
      // })


            db.collection('Todos').find({
              _id: new ObjectID('5a15e4b1fd10c957ec3b19c1')
            }).toArray().then((docs) => {
              console.log('Specific Todos')
              console.log(JSON.stringify(docs, undefined, 2))
            }, (err) => {
              cosnole.log('Unable to fetch todos', err)
            })

            db.collection('Todos').find({completed: true}).count().then((count) => {
              console.log('Todos count')
              console.log(`todos count ${count}`)
            }, (err) => {
              cosnole.log('Unable to fetch todos', err)
            })

            db.collection('Users').findOne({name: 'Quin'}).then((doc) => {
              console.log('User Quin')
              console.log(JSON.stringify(doc, undefined, 2))
            }, (err) => {
              cosnole.log('Unable to fetch todos', err)
            })
      // db.close();
    });
