const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const port = 30001

const app = express()
app.use(bodyParser.json())
app.use(cors())

mongoose.connect('mongodb+srv://gdev:admin@cluster0.lx0zr4n.mongodb.net/customer_details')
const schemaUser = new mongoose.Schema({
  email:String,
  password:String
})

const modelUser = mongoose.model('registration', schemaUser)

app.post('/api/signup', async (req,res)=>{
  const {email, password, confirmpassword}  = req.body
  const checkEmail = await modelUser.findOne({email})
  if(checkEmail){return res.send({message:'ALREADY_USER_PRESENT'})}
  if(password !== confirmpassword){return res.send({message:'PASSWORD_NOT_SAME'})}
  const p = jwt.sign({password},'deva-password')
  const user = new modelUser({email,password:p})
  await user.save()
  res.send({message:'successfully'})
})

app.post('/api/signin', async (req,res)=>{
  const { email, password } = req.body;
  const user = await modelUser.findOne({ email });
  const pv = jwt.verify(user.password,'deva-password')
  if (user && pv.password === password) {
    res.send({ message: 'LOGIN_SUCCESS' });
  } else {
    res.send({ message: 'Invalid email or password' });
  }
});


app.listen(port, ()=>{
  console.log('port run');
})