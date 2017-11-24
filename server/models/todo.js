
const mongoose = require('mongoose')

var Todo = mongoose.model('Todo', {
  text: {
    // type starts with capital letter
    type: String,
    require: true,
    minlength: 1,
    //removes leading and trailing spaces
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// var newtodo = new Todo({
//   text: '   Finish Api Today!!!    ',
//   completed: false,
//   completedAt: ''
// })
//
// newtodo.save().then((doc) => {
//   console.log('New todo created')
//   console.log(doc)
// }, (e) => {
//   console.log(e)
// })
module.exports ={ Todo }
