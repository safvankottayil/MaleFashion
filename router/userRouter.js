const express=require('express')
const  user_router=express()

const usercontroller=require('../controllers/usercontrollers')
const userAuth=require('../middlewere/userAuth')
const ordercontroller=require('../controllers/Ordercontrollers')
user_router.set('views','./views/user')
user_router.use(express.static('./public'));


user_router.get('/',usercontroller.renderHome)
user_router.get('/login',usercontroller.renderLogin)
user_router.post('/login',usercontroller.verifyLogin)
user_router.get('/otp-login',usercontroller.renderOtp)
user_router.post('/otp-login',usercontroller.otpsend)
user_router.get('/otp-verify',usercontroller.renderOtpverify)
user_router.post('/otp-verify',usercontroller.otpverify)
user_router.get('/register',usercontroller.renderRegister)
user_router.post('/register',usercontroller.veryfyRejister)
user_router.get('/verify',usercontroller.Emailverify)
user_router.get('/shopping',usercontroller.renderShop)
user_router.get('/product-deatil',usercontroller.renderProductDeatil)
user_router.post('/product-filter',usercontroller.productfilter)
user_router.get('/userProfile',userAuth.isLogin,usercontroller.renderUserprofile)
user_router.get('/logout',usercontroller.logout)
user_router.get('/add-address',userAuth.isLogin,usercontroller.renderaddAddress)
user_router.post('/add-address',userAuth.isLogin,usercontroller.addAddress)
user_router.get('/user-address',userAuth.isLogin,usercontroller.useraddress)
user_router.post('/edit-address',userAuth.isLogin,usercontroller.editaddress)
user_router.get('/delete-address', userAuth.isLogin,usercontroller.deleteAddress)
user_router.get('/cart', userAuth.isLogin,usercontroller.CartRender)
user_router.post('/addCart',userAuth.isLogin,usercontroller.addCart)
user_router.post('/decrement',userAuth.isLogin,usercontroller.decrement)
user_router.post('/increment',userAuth.isLogin,usercontroller.increment)
user_router.post('/deletecart',usercontroller.deletecart)
user_router.post('/profileEdit',usercontroller.profileEditOtpsend)
user_router.post('/profieEditOtp',usercontroller.profileOtpVerify)
user_router.post('/editedProfile',usercontroller.submiteditedProfile)
user_router.get('/checkout',usercontroller.rendercheckout)
///////////////////ORDER CONTROLERR//////////////
user_router.get('/orderinsert',ordercontroller.insertOrder)
user_router.get('/orsersuccess',ordercontroller.ordersuccesspage)
user_router.get('/orderCancel',ordercontroller.oredercancel)
user_router.get('/orderlist',ordercontroller.renderOrderlist)
user_router.get('/orderview',ordercontroller.renderorderview)





module.exports=user_router