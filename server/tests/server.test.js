
      const expect = require('expect');
      const request = require('supertest');

      const {ObjectID} = require('mongodb');

      var {app} = require('./../server');
      var {Todo} = require('./../models/todo');

      const todosList = [{
        _id: new ObjectID(),
        text: 'test todo 1'
      }, {
        _id: new ObjectID(),
        text: 'test todo two'
      }]

      // lets you run some code before every test
      //testing lifecycle method
      //using to setup database
      beforeEach((done) => {
        Todo.remove({}).then(() => {
          Todo.insertMany(todosList);
        }).then(() => done());
      });

      describe('Post todos', () => {

        it('Should create a new todo', (done) => {
          var text = "The test todo text";

          request(app)
          .post('/todos')
          //since we're requesting data
          .send({text: text})
          .expect(200)
          .expect((res) => {
            expect(res.body.text).toBe(text)
          })
          .end((err, res) => {
            if(err){
              return done(err)
            }

            Todo.find({text: text}).then((todos) => {
              expect(todos.length).toBe(1);
              expect(todos[0].text).toBe(text);
              done();
            }).catch((e) => {
              done(e)
            })
          })
        });


        it('Should not create todo with invalid data', (done) => {

          request(app)
          .post('/todos')
          .send({text: ''})
          .expect(400)
          .end((err, res) => {
            if(err){
              return done(err)
            }

            Todo.find().then((todo) => {
              expect(todo.length).toBe(2)
              done();
            }).catch((e) => {
              done(e)
            })
          })

        });

        describe('GET /todos', () => {
          it('Should get all of the todos', (done) => {

            request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
              expect(res.body.todos.length).toBe(2)
            })
            .end(done);
          })
        })

        describe('GET /todos:id', () => {
          it('Should return todo doc', (done) => {

            request(app)
            // toHexString converts object IDs to a string
            .get(`/todos/${todosList[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
              expect(res.body.todo.text).toBe(todosList[0].text)
            })

            .end(done)
          })

          it('Should retun a 404 if todo not found', (done) => {
            // use valid ID that is not found
            var hexId = new ObjectID().toHexString();
            request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done)
          })

          it('Should retun a 404 for non object IDs', (done) => {
            // /todos/123 use invalid ID
            request(app)
            .get('/todos/123')
            .expect(404)
            .end(done)
          })


        })

        describe('DELETE /todos:id', () => {

          it("Should remove a todo", (done) => {
            var hexId = todosList[0]._id.toHexString()
            request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
              expect(res.body.todo._id).toBe(hexId)
            })
            .end((err, res) => {
              if(err){
                return done(err)
              }
              Todo.findById(hexId).then((todo) => {
                expect(todo).toNotExist()
                done()
              }).catch((e) => {
                done(e)
              })
            })
          })

          it("Should return 404 if todo is not found", (done) => {
            var hexId = new ObjectID().toHexString();
            request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done)
          })

          it("Should return 404 if objectID is invalid", (done) => {
            request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done)
          })
        })

      });
