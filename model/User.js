const mongoose = require('mongoose');
// const Schema = mongoose.Schema(); //这种方式会报错
const { Schema } = mongoose;

//创建userSchema
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  identity:{
    type:String,
    require:true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = User = mongoose.model('Users', userSchema)