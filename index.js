const express=require('express')
const logger=require('morgan')
require('dotenv').config()
const path=require('path')
const nocache=require('nocache')
const session=require('express-session')
const consfig=require('./config/config')

const port=process.env.PORT
//mongoose connect
consfig.mongooseConnection()

const userRouter=require('./router/userRouter')
const adminRouter=require('./router/adminRouter')

const app=express()
app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(logger('dev'))
app.use(nocache())
app.use(session({secret:process.env.SECRET_KEY,resave:true,saveUninitialized:true}))

app.use('/admin',adminRouter)
app.use('/',userRouter)

app.listen(port,()=>{
    console.log('server running');
})