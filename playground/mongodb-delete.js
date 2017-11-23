
    const {MongoClient, ObjectID} = require('mongodb');

    MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
      if(err){
        return console.log('Unable to connect to MongoDb server')
      }
      console.log('Connected to MongoDb server')

      //delete many
      // db.collection('Todos').deleteMany({test: 'Keep working again'}).then((result) => {
      //   console.log(result)
      // })

      //deleteOne
      // db.collection('Todos').deleteOne({test: 'Keep working'}).then((result) => {
      //   console.log(result)
      // })

      //findOneAndDelete
      db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
        console.log(result)
      });


      // db.close();
    });
