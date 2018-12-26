const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

const users = require('./routes/api/user')
const profiles = require('./routes/api/profiles');

//db config
const db = require('./config/key').mongoURI;

// db connect
mongoose.connect(db)
  .then(() => console.log('mongoDB connect'))
  .catch(() => console.log('connect failed'))

//配置 body-parser的中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//传递passport
require('./config/passport')(passport);

//初始化passport
app.use(passport.initialize());


//加载api中的接口
app.use('/api/users', users);
//加载 profiles.js中的接口
app.use('/api/profiles', profiles);
const port = process.env.PROT || 5000;


//监听端口
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})