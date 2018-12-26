const express = require('express');
const router = express.Router();
const passport = require('passport')

const Profile = require('../../model/Profile');


router.get('/test', (req, res) => {
  res.json('profiles work')
})


//@router /api/profiles/add
//@desc  添加条目
//@access private

router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
  const profileFieds = {};

  if (req.body.type) profileFieds.type = req.body.type;
  if (req.body.describe) profileFieds.describe = req.body.describe;
  if (req.body.income) profileFieds.income = req.body.income;
  if (req.body.expend) profileFieds.expend = req.body.expend;
  if (req.body.cash) profileFieds.cash = req.body.cash;
  if (req.body.remark) profileFieds.remark = req.body.remark;

  new Profile(profileFieds).save().then(profile => {
    res.json(profile)
  }).catch(err => {
    res.status('400').json('保存错误')
  })
});


//@router /api/profiles/list
//@desc 获取所有条目
//@access  private

router.get('/list', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.find()
    .then(profiles => {
      if (profiles) {
        return res.json(profiles)
      }
      return res.json('没有找到任何内容')
    })
    .catch(err => res.json('获取条目失败'))
});


//@router /api/profiles/:id
//@desc 获取单个条目
//@access Private

router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({_id: req.params.id})
    .then(profile => {
      if (profile) {
        return res.json(profile)
      }
      return res.json({status: 200, msg: '没有找到内容'})
    })
    .catch(err => res.json('获取条目失败'))
});


//@router /api/profiles/edit/:id
//@desc 编辑单个条目
//@access Private
router.post('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const profileFiled = {};
  if (req.body.type) profileFiled.type = req.body.type;
  if (req.body.describe) profileFiled.describe = req.body.describe;
  if (req.body.income) profileFiled.income = req.body.income;
  if (req.body.expend) profileFiled.expend = req.body.expend;
  if (req.body.cash) profileFiled.cash = req.body.cash;
  if (req.body.remark) profileFiled.remark = req.body.remark;


  Profile.findOneAndUpdate(
    {_id: req.params.id},
    {$set: profileFiled},
    {new: true}
  ).then(profile => res.json(profile))
    .catch(err => res.json('修改条目失败'))
});

//@router delete  /api/profiles/edit/:id
//@desc 编辑单个条目
//@access Private

router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOneAndRemove({_id: req.params.id})
    .then(profile => {
      profile.save().then(profile => {
          return res.json(profile)
        }
      )
    })
    .catch(err => res.json('删除失败'))
});


module.exports = router;