
    //mongo client lets you connect to a mongo server and issue commands
    // const MongoClient = require('mongodb').MongoClient;
    //object destructoring = pull out properties from an object and create variables
    // var user = {name: 'Quin', age: 29}
    // var {name} = user;

    // this is destructored
    const {MongoClient, ObjectID} = require('mongodb');

    // var obj = new ObjectID();


    MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
      if(err){
        return console.log('Unable to connect to MongoDb server')
      }
      console.log('Connected to MongoDb server')
      // console.log(obj)

      // db.collection('Todos').insertOne({
      //   test: 'a todo',
      //   completed: false
      // }, (err, result) => {
      //   if(err){
      //     return console.log('Unable it insert todo', err)
      //   }
        // ops store everything that was insterted
      //   console.log(JSON.stringify(result.ops))
      // })

        // db.collection('Users').insertOne({
        //   name: 'Quin',
        //   age: 29,
        //   loacation: 'Charlotte'
        // }, (err, results) => {
        //   if(err){
        //     return console.log('Wasn\'t abe to insert users', err)
        //   }
        //   console.log(JSON.stringify(results.ops[0]._id.getTimestamp()))
        // })


      db.close();
    });
