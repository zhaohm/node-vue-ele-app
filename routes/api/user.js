const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../../model/User');
const keys = require('../../config/key');



//$route post /api/user/register
//@desc 注册用户
//@access  public
router.post('/register', (req, res) => {
  User.findOne({email: req.body.email})
    .then((user) => {
      if (user) {
        return res.status(400).json({mag: '该邮箱已被占用'})
      } else {
        /* mm  获取默认头像*/
        const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'})
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password,
          identity:req.body.identity
        })
        //对password进行加密
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash;
            newUser.save()
              .then((user) => res.json(user))
              .catch(console.log(err));
          });
        });

      }
    })
});

//$route /api/user/login
//@desc jwt 设置token

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email})
    .then((user) => {
      if (!user) {
        return res.status(404).json({msg: '用户不存在'})
      } else {
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              const rule = {
                id: user.id,
                name: user.name,
                avatar:user.avatar,
                identity:user.identity
              };
              //参数1：token生成规则
              //@2 key
              //@3设置过期时间
              //callback  函数
              jwt.sign(rule, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
                if (err) throw err;
                res.json({
                  status: 'success',
                  token: 'Bearer ' + token
                })
              })
            } else {
              return res.status(400).json({msg: '密码错误'});
            }
          })
      }
    })
});

//校验token
//$route /api/user/currentUser
//@desc 验证token 返回当前用户

router.get('/currentUser', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    identity:req.user.identity
  })
});


module.exports = router;