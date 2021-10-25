var express = require('express');
var router = express.Router();
const {User} = require('../models/users_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {validate} = require('../method/validition');
const {valid} = require('../method/val-auth');
const { checkSchema } = require('express-validator');

function DTO ({_id, name, email, phone, category, role}){
  return {
    id:_id,name,email,phone,category,role
  }
}

router.get('/' , async (req, res) => {
  const   users = await User.find()
  res.json({users})
})

router.get('/me', validate ,async (req, res)=>{
  const data = await User.findById(req.users.id);
  const user = DTO(data);
  res.json({user,token: jwt.sign(user , '123456789')})
})

router.post('/sign' ,
checkSchema({
  name:{
    notEmpty:true,
  },
  email:{
    notEmpty:true,
    normalizeEmail:true,
  },
  password:{
    notEmpty:true,
    isStrongPassword:true,
  },
  phone:{
    notEmpty:true,
    isMobilePhone:true,
    isNumeric:true,
  }
}),
valid, async (req, res) => {
  const { name,email,password,phone,category,address } =req.body;
  let status = {}; 
  let response ={};
  
  const existUser = await User.findOne({$or: [
    {email},
    {phone}
  ]})
  if(existUser){
    status =400;
    response.msg ="User Already Exists"
  }else{
    const user = User({
      name, email , password , phone , category , address
    })
    user.password= bcrypt.hashSync(password,10)
    await user.save();
    status =200;
    response.msg ="User Created Successfully"
    // res.status(200).json({
      //   msg: 'user created successfully'
      // })
  }
  res.status(status).json(response)
})

router.post('/login' ,
checkSchema({
  email:{
    notEmpty:true,
    normalizeEmail:true,
  },
  password:{
    notEmpty:true,
    isStrongPassword:true,
  },
  
}),
valid, async (req, res) =>{
  let status = {}; 
  let response ={};
  const {email ,password} = req.body;

  function invalid() {
    status=400;
    response.msg = 'invalid email or password';
  }
  const user = await User.findOne({email});

  if(!user){
    invalid()
  }else{
    const pass = bcrypt.compareSync(password, user.password)
    if(!pass){
      invalid()
    }else{
      status= 200;
      response.user = DTO(user);
      response.token = jwt.sign(response.user, '123456789')
    }
  }
  res.status(status).json(response)
})

module.exports = router;
