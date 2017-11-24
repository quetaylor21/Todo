
      const expect = require('expect');
      const request = require('supertest');

      var {app} = require('./../server');
      var {Todo} = require('./../models/todo');

      // lets you run some code before every test
      //testing lifecycle method
      //using to setup database
      beforeEach((done) => {
        Todo.remove({}).then(() => {
          done();
        });
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

            Todo.find().then((todos) => {
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
              expect(todo.length).toBe(0)
              done();
            }).catch((e) => {
              done(e)
            })
          })

        });
      });
