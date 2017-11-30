
// Just for playground purposes
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// takes two arguments... the amount of rounds and a callback
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   })
// })

var hashed = '$2a$10$/AWlunL.oBPPoK5RVgKlKub1TedExj6D5pJHjDakgbh5KBsSs8yxm';

bcrypt.compare(password, hashed, (err, result) => {
  console.log(result);
})

// var data ={
//   id: 4
// };
// // takes the object and signs it
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
// // takes token and secret and verifies it
// jwt.verify(token, '12abc')
// var message = "I am user number 3";
//
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hashing: ${hash}`);
//
// var data = {
//   id: 4
// }
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data).toString())
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()
//
// if(resultHash === token.hash){
//   console.log("Access granted");
// }else{
//   console.log('Data was changed. dont allow access');
// }
