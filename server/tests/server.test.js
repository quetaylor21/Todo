
      const expect = require('expect');
      const request = require('supertest');
      const _ = require('lodash')

      const {ObjectID} = require('mongodb');

      const {app} = require('./../server');
      const {Todo} = require('./../models/todo');
      const {User} = require('./../models/user');
      const {todosList, populateTodos, users, populateUsers} = require('./seed/seed')


      // lets you run some code before every test
      //testing lifecycle method
      //using to setup database
      beforeEach(populateUsers);
      beforeEach(populateTodos);

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

        describe('Patch /todos/:id', () => {
          it('Should update the todo', (done) => {
            var id = todosList[0]._id.toHexString();
            var text = 'The test text';

            request(app)
            .patch(`/todos/${id}`)
            .send({
              text,
              completed: true
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.todo.text).toBe(text)
              expect(res.body.todo.completed).toBe(true)
              expect(res.body.todo.completedAt).toBeA('number')
            })
            .end(done)

          })

          it('Should clear completedAt when todo is not completed', (done) => {

            var id = todosList[1]._id.toHexString();
            var text = 'The test text for second todo';

            request(app)
            .patch(`/todos/${id}`)
            .send({
              completed: false,
              text
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.todo.text).toBe(text)
              expect(res.body.todo.completed).toBe(false)
              expect(res.body.todo.completedAt).toNotExist()
            })
            .end(done)
          })
        })

        describe('Get /users/me', () => {
          it('Should return user if authenticated', (done) => {

            request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
              expect(res.body._id).toBe(users[0]._id.toHexString())
              expect(res.body.email).toBe(users[0].email);
            })
            .end(done)

          })

          it('should return a 401 if not authenticated', (done) => {
            request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
              expect(res.body).toEqual({})
            })
            .end(done)
          })
        })

        describe('POST /users', () => {

          it('Should create a user', (done) => {
            var email = 'que@email.com';
            var password = '123abc!';

            request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
              expect(res.headers['x-auth']).toExist()
              expect(res.body._id).toExist()
              expect(res.body.email).toBe(email)
            })
            .end((err) => {
              if(err){
                return done(err)
              }
              User.findOne({email}).then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
              }).catch((err) => {
                done(err);
              })
            })
          })

          it('Should return validation errors if request invalid', (done) => {

            var email = 'hey';
            var password = '12'
            request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
          })

          it('should not create user if email in use', (done) => {

            var email = users[0].email;
            var password = 'ready2go'
            request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
          })
        })

        describe('POST /users/login', () => {
          it('Should login user and return auth token', (done) => {
            var email = users[1].email;
            var password = users[1].password;
            request(app)
            .post('/users/login')
            .send({email, password})
            .expect(200)
            .expect((res) => {
              expect(res.headers['x-auth']).toExist()
            })
            .end((err, res) => {
              if(err){
                return done(err)
              }
              User.findById(users[1]._id).then((user) => {
                expect(user.tokens[0]).toInclude({
                  access: 'auth',
                  token: res.headers['x-auth']
                });
                done();
              }).catch((e) => {
                done(e);
              })
            })
          })

          it('Should reject invalid login', (done) => {
            var email = users[1].email;
            var password = 'password';
            request(app)
            .post('/users/login')
            .send({email, password})
            .expect(400)
            .expect((res) => {
              expect(res.headers['x-auth']).toNotExist()
            })
            .end((err, res) => {
              if(err){
                return done(err)
              }
              User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(0)
                done();
              }).catch((e) => {
                done(e);
              })
            })
          })
        })
