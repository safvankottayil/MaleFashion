const User = require("../models/usermodel")
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const Category = require('../models/categoryModel')
const Product = require('../models/prodectModel')
const Cart = require('../models/CartModel')
const Order=require('../models/Ordermodel')
const Banner=require('../models/bannerModal')
const Coupon=require('../models/CouponModel')
const Review=require('../models/reviewModel')
const { default: mongoose } = require("mongoose")
const { populate } = require("../models/usermodel")
const { ObjectId } = mongoose.Types
accountsid = process.env.ACCOUNT_SID
authtoken = process.env.AUTH_TOKEN
servies_id = process.env.VERIFY_SID
console.log(process.env.RAZERPAY_KEY);
let c=1
const Razorpay=require('razorpay')
const  instance = new Razorpay({
    key_id: process.env.RAZERPAY_KEY,
    key_secret:process.env.RAZERPAY_SECRET_KEY,
  });
let deleteAlert = false
const Client = require('twilio')(accountsid, authtoken)


let message
let productDetialError



const encriptPassword = (password) => {
    const passwordMacth = bcrypt.hash(password, 10)
    return passwordMacth
}
const sendEmailverify = (email, name, user_id) => {
    try {
        console.log('dfvdsghhcdscdbcdskchvjbdsjc');
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'malefashionfation@gmail.com',
                pass: "rrmxdmdwletsxrzs"
            }
        });
        const mailOption = {
            from: 'p7693088@gmail.com',
            to: email,
            subject: 'Email verifycation',
            html: `<p>Hai${name}please click <a href="http://localhost:2000/verify?id=${user_id}></a></p>"`
        }
        transporter.sendMail(mailOption, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info.response);
            }

        })

    } catch (err) {
        console.log(err);
    }
}

const renderHome = async (req, res) => {
    try {
        const banner=await Banner.find()
        res.render('home', { x: req.session.user_id,banner})
    } catch (err) {
        console.log(err);
    }
}
const renderLogin = async (req, res) => {
    try {
        res.render('login')
    } catch (err) {
        console.log(err);
    }
}
const renderRegister = async (req, res) => {
    try {
        res.render('register')
    } catch (err) {
        console.log(err);
    }

}
const verifyLogin = async (req, res) => {
    try {
        const { loginEmail, loginPassword } = req.body.loginData
        const userData = await User.findOne({ email: loginEmail })
        if (userData) {
            if (userData.is_verfyed == 1) {
                console.log(userData.password);
                const hashpassword = await bcrypt.compare(loginPassword, userData.password)
                console.log(hashpassword);
                if (hashpassword) {
                    if (userData.is_blocked) {
                        res.send({ emailError: 'user is bloked' })
                    } else {
                        req.session.user_id = userData._id
                        res.json({ success: true })
                    }

                } else {
                    res.send({ passwordError: 'password invalid' })
                }
            } else {
                res.send({ emailError: 'Email not verifyed' })
            }

        } else {
            res.send({
                emailError: 'Email not required',
                passwordError: 'password not requred'
            })
        }
    } catch (err) {
        console.log(err);
    }
}


const veryfyRejister = async (req, res) => {

    const { name, email, mobile, password } = req.body.formdata
    const userdata = await User.findOne({ email: email,is_verfyed:true })
    console.log(userdata);
    if (userdata) {
        res.send({ response: 'This email alredy used' })
    } else {
        const bcryptpassword = await encriptPassword(password)
        const user = await User({
            name: name,
            email: email,
            mobile: mobile,
            password: bcryptpassword,
            status: true,
            is_verfyed: false
        })
        await User.create(user)
        if (user) {
            const userdata = await User.findOne({ email: email })
            console.log(userdata);
            sendEmailverify(email, name, userdata._id)
            res.status(200).json({ success: true })
        }

    }




}
const Emailverify = async (req, res) => {
    try {
        const ID = req.query.id
        console.log(ID);
        const x = await User.updateOne({ _id: ID }, { $set: { is_verfyed: true } })
        console.log(x);
        res.render('email_verify')
    } catch (err) {
        console.log(err);
    }
}
////////////RENDER OTP PAGE////////////
const renderOtp = async (req, res) => {
    try {
        res.render('otp_login', { x: req.session.user_id, message })
        message = null
    } catch (err) {
        console.log(err);
    }
}
console.log(servies_id);
///////////////OTP-SEND///////////
const otpsend = async (req, res) => {
    try {
        const { mobile } = req.body
        console.log(mobile);
        const userData = await User.findOne({ mobile: mobile })
        console.log(userData);
        if (userData) {
            console.log(userData.is_verfyed);
            if (userData.is_verfyed) {
                req.session.mobile = mobile
                Client.verify.v2
                    .services(servies_id)
                    .verifications.create({ to: `+91${mobile}`, channel: 'sms' })
                    .then((verifycation) => {
                        res.redirect('/otp-verify')
                    }).catch((err) => {
                        console.log('hggzxdfghgfcgh');
                        console.log(err);
                    })
            } else {
                message = 'This number not verifyid'
                res.redirect('/otp-login')
            }

        } else {
            message = 'This number not verifyid'
            res.redirect('/otp-login')
        }
    } catch (err) {
        console.log(err);
    }
}
/////////RENDER OTP VERIFY PAGE////////////
const renderOtpverify = async (req, res) => {
    try {
        res.render('otp_verify', { x: req.session.user_id, message })
    } catch (err) {
        console.log(err);
    }

}
///////////CONFORM THE OTP //////////////
const otpverify = async (req, res) => {

    const { otp } = req.body
    const mobile = req.session.mobile
    const userData = await User.findOne({ mobile: mobile })
    console.log(mobile, otp);
    Client.verify.v2.services(servies_id)
        .verificationChecks.create({ to: `+91${mobile}`, code: otp })
        .then(async (verification_chek) => {
            if (verification_chek.status == 'approved') {
                req.session.user_id = userData._id
                res.redirect('/')
            }
        }).catch((err) => {
            console.log(err);
        })

}
/////shopping page reder//////////////
const renderShop = async (req, res) => {
    try {
        const categoryData = await Category.find()
        const ProductData = await Product.find({ status: true })
        // const productData=await Product.findOne({_id:req.query.id}).populate('ca
        const barnd = await Product.find().distinct('brand')
        console.log(barnd);
        res.render('product', {
            pro_Data: ProductData,
            cate_Data: categoryData,
            barnd,
            x: req.session.user_id
        })
    } catch (err) {
        console.log(err);
    }
}

/////////////////////////PRODUCT DEATEIL RENDER/////////////
const renderProductDeatil = async (req, res) => {
    try {
        let ThisuserReview
        let liked=[]
        const user_id=req.session.user_id
        const productData = await Product.findOne({ _id: req.query.id, status: true }).populate('category')
        if(productData){
            let OrderData=false
        const price = productData.price
        const discount = productData.discount
        const discountPrice = price - discount
        const persentage = Math.round((100 * discount) / price)
        let ThisproductUsedcart=false
        if(user_id){
            const order=await Order.findOne({user:user_id,'order.product_id':req.query.id})
            if(order){
             Data=order.order.filter((value)=>{
                return value.status=='delivered'
            })
            if(Data[0]){
                OrderData=true
            }

        }
            console.log(1234);
            console.log(OrderData);
        const CartData=await Cart.findOne({user:user_id,'products.product':req.query.id})
        console.log(CartData);
        if(CartData){
             ThisproductUsedcart=true
        }else{
             ThisproductUsedcart=false
        }
    }
    const review=await Review.findOne({product:req.query.id}).populate('reviews.user')
if(review){
    const user_id=req.session.user_id
    const userReview=review.reviews.filter((value)=>{
        return value.user._id==user_id
    })
    ThisuserReview=userReview[0]
    const reviewID=review.reviews.map((value)=>{
        return value.user._id
    })
    reviewID.forEach((value,i)=>{
        let count=0
        if(review.likes[0]){
        review.likes.forEach((element)=>{
          if(value.equals(element.reviewOwner)&&element.user==user_id){
            if(element.like){
                count=1
                liked[i]={like:true,dislike:false}
            }else {
                count=1
                liked[i]={like:false,dislike:true}
            }
          }else if(count==0){
            liked[i]={like:false,dislike:false}
          }
        })
                
        }else{
            liked[i]={like:false,dislike:false}
        }
    })
}


        const relatedData = await Product.find({ category: productData.category, status: true }).limit(4)
        res.render('product_deatil', {
             pro_Data: productData,
              relatedData,
               persentage,
                discountPrice,
                 x: req.session.user_id,
                  productDetialError,
                  ThisproductUsedcart,
                  ThisuserReview,
                  review,
                liked,
                OrderData
                 })
        productDetialError = null
                }else{
                    res.redirect('/shopping')
                }
    } catch (err) {
        console.log(err);
    }
}
///////////////RENDER USER PROFILE///////////////////
const renderUserprofile = async (req, res) => {
    try {
        const user_id = req.session.user_id
        const user = await User.findOne({ _id: user_id })
        console.log(user);
        res.render('userProfile', { x: req.session.user_id, user })
    } catch (err) {

    }
}
const logout = async (req, res) => {
    try {
        req.session.user_id = null
        res.redirect('/')
    } catch (err) {
        console.log(err);
    }
}
//////////////////ADD ADDRESS///////////////
const renderaddAddress = async (req, res) => {
    try {
        user_id = req.session.user_id
        const index = req.query.index
        const user = await User.findOne({ _id: user_id })
        const address = user.address[index]
        console.log(address);
        res.render('add_address', { x: req.session.user_id, address,index })

    } catch (err) {
        console.log(err);
    }
}

///////////////////ADD ADDRESS/////////////////////
const addAddress = async (req, res) => {
    try {

        const user_id = req.session.user_id
       
            
        const { name, mobile1, pincode, lo, address, district, state, landmark, mobile2, addressType } = req.body
        console.log(req.body);

        const userDeatil = await User.findByIdAndUpdate({ _id: user_id }, {
            $push: {
                address: {
                    name: name,
                    mobile1: mobile1,
                    mobile2: mobile2,
                    pincode: pincode,
                    location1: lo,
                    address: address,
                    district: district,
                    state: state,
                    landmark: landmark,
                    addressType: addressType
                }
            }
        })
        const user=await User.findOne({_id:user_id})
        const index= user.address.length-1
        console.log();
        if(req.query.checkout){
            if(req.body.payment=='cash'){
                res.redirect('/orderinsert?index='+index)
            }
            else if(req.body.payment=='wallet'){
                res.redirect('/orderinsert?index='+index+'&type=wallet')
            }
            else if(req.body.payment=='paypal'){
                const cartData=await Cart.findOne({user:user_id})
                let total
                if(cartData.couponDiscount){
                    console.log(cartData);
                    console.log(1);
                    total=cartData.grandtotal-cartData.grandDiscount-cartData.couponDiscount
                }else{
                    console.log(cartData);
                    console.log(2);
                    total=cartData.grandtotal-cartData.grandDiscount
                }
                
                const options = {
                    amount: total*100,  // amount in the smallest currency unit
                    currency: "INR",
                    receipt: "order_rcptid_11"
                  };
                 const order=await instance.orders.create(options)
                 req.session.order=order
                 res.redirect('/checkout?index='+index)
            }
        }else{
        res.redirect('/add-address')
        
        }
    } catch (err) {
        console.log(err);
    }
}
////////////REDER USER ADDRESS//////////
const useraddress = async (req, res) => {
    try {
        const ischeckout=req.query.checkout
        const user_id = req.session.user_id
        const userData = await User.findOne({ _id: user_id })
        const Data = userData.address
        console.log(Data);
       
        res.render('userAddress', { x: req.session.user_id, Data, deleteAlert,ischeckout})
        deleteAlert = null
    } catch (err) {
        console.log(err);
    }
}
////////////////EDIT ADDRESS/////////////
const editaddress = async (req, res) => {
    try {
        const {id,index} = req.query
        console.log(req.query);
        
        const user_id = req.session.user_id
       
        const { name, mobile1, pincode, location1, address, district, state, landmark, mobile2, addressType,payment } = req.body
        console.log(location1);
        await User.updateOne({ address: { $elemMatch: { _id: id } } }, {
            $set: {
                'address.$.name': name,
                'address.$.mobile1': mobile1,
                'address.$.mobile2': mobile2,
                'address.$.pincode': pincode,
                'address.$.location1': location1,
                'address.$.address': address,
                'address.$.district': district,
                'address.$.state': state,
                'address.$.landmark': landmark,
                'address.$.addressType': addressType
            }
        })
        
        if(req.query.index){
           if(payment=='cash'){
           res.redirect('/orderinsert?index='+index)
           }else if(payment=='paypal'){
            const cartData=await Cart.findOne({user:user_id})
            let total
            if(cartData.couponDiscount){
                console.log(cartData);
                console.log(1);
                total=cartData.grandtotal-cartData.grandDiscount-cartData.couponDiscount
            }else{
                console.log(cartData);
                console.log(2);
                total=cartData.grandtotal-cartData.grandDiscount
            }
            console.log(typeof(total));
            
c++
            const options = {
                amount: total*100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "order_rcptid_11"+c
              };
             const order=await instance.orders.create(options)
             console.log(order);
             console.log(1);
             req.session.order=order
             res.redirect('/checkout?index='+index)
           }else if(payment=='wallet'){
            res.redirect('/orderinsert?index='+index+'&type=wallet')
           }
        } else{
            res.redirect('/add-address')
        }
    } catch (err) {
        console.log(err);
    }
}
/////////////delete address//////////////////
const deleteAddress = async (req, res) => {
    try {
        const ID = req.query.id
        user_id = req.session.user_id
        await User.updateOne({ _id: user_id }, { $pull: { 'address': { _id: ID } } })
        deleteAlert = true
        res.redirect('/user-address')
    } catch (err) {
        console.log(err);
    }
}

////////////////////CART RENDER///////////////
const CartRender = async (req, res) => {
    try {
        const user_id = req.session.user_id
        const cartData = await Cart.findOne({ user: user_id }).populate('products.product')
        if(cartData){
        const subtotal  = cartData.grandtotal
        const subTotaldiscount=cartData.grandDiscount
        const coupon=await Coupon.find({Maximumprice:{$lte:subtotal-subTotaldiscount},is_expire:true,'users.user':{$ne:user_id}})

        res.render('cart', { x: req.session.user_id, cartData, subtotal,subTotaldiscount,coupon })
    }else{
        res.send('hfdhgads')
    }
    } catch (err) {
        console.log(err);
    }
}
///////////////////////ADD CART//////////////////////
const addCart = async (req, res) => {
    try {
        const ID = req.query.id
        const user_id = req.session.user_id
        const { size, color } = req.body
        const pr = await Product.find({ _id: ID })
        if (req.body.size || req.body.color) {

            const product = await Product.aggregate([
                {
                    $match: { _id: new ObjectId(ID) }
                }

            ])
            const user_alredy_Usedcart = await Cart.findOne({ user: user_id })
            const discount = product[0].discount
            const price = product[0].price
            if (user_alredy_Usedcart) {
                await Cart.updateOne({ user: user_id }, {
                    $push: {
                       
                        products: {
                            product: product[0]._id,
                            totalprice: price,
                            color: color,
                            size: size,
                            totaldiscount: discount
                        }

                    },$set:{ grandtotal:Number(user_alredy_Usedcart.grandtotal+price),
                        grandDiscount:Number(user_alredy_Usedcart.grandDiscount+discount)}
                })
                res.redirect('/cart')
            } else {
                console.log(discount);
                const cart = await Cart({
                    grandtotal:Number(price),
                    grandDiscount:Number(discount),
                    user: user_id,
                    'products.0.product': product[0]._id,
                    'products.0.totalprice': price,
                    'products.0.size': size,
                    'products.0.color': color,
                    'products.0.totaldiscount': discount
                }).save()
            }
            res.redirect('/cart')

        } else {
            productDetialError = true
            res.redirect('/product-deatil?id=' + ID)
        }

    } catch (err) {
        console.log(err);
    }
}
////////////STOCK DECREMENT////////////////
const decrement = async (req, res) => {
    try {
        // console.log(req.qurey);
        const user_id = req.session.user_id

        const ProductID = req.query.id
        //   console.log(user_id,ProductID);
        let CartData = await Cart.findOne({ user: user_id, 'products.product': ProductID })
        const productData = await Product.findOne({ _id: ProductID })
        let cartProductDatial = CartData.products.filter(value => {
            return value.product == ProductID
        })
        if (cartProductDatial[0].stock <= 1) {
            res.json({x:'rjgioreg'})
        } else {

            const Cartdecrement = await Cart.updateOne({ user: user_id, "products.product": ProductID }, { $inc: { 'products.$.stock': -1 } })

            CartData = await Cart.findOne({ user: user_id, 'products.product': ProductID })
            cartProductDatial = CartData.products.filter(value => {
                return value.product == ProductID
            })
            const price = productData.price
            const stock = cartProductDatial[0].stock
            const totalprice = price * stock
            const totaldiscount = stock * productData.discount

            const updateCart = await Cart.findOneAndUpdate({ user: user_id, 'products.product': ProductID }, {
                $set: {
                    'products.$.totalprice': totalprice,
                    'products.$.totaldiscount': totaldiscount
                }
            })
            CartData = await Cart.findOne({ user: user_id, 'products.product': ProductID })
            const subtotal = CartData.products.map((value) => {
                return value.totalprice
            }).reduce((total, value) => {
                return total = total + value
            }, 0)
            const subTotaldiscount=CartData.products.map((value)=>{
                return value.totaldiscount
            }).reduce((total,value)=>{
                return total=total+value
            },0)
            await Cart.updateOne({user:user_id},{$set:{grandtotal:subtotal,grandDiscount:subTotaldiscount}})
            const coupon=await Coupon.find({Maximumprice:{$lte:subtotal-subTotaldiscount},is_expire:true,'users.user':{$ne:user_id}})
              if(CartData.couponID){
                await Coupon.updateOne({_id:CartData.couponID,'users.user':user_id},{$pull:{users:{user:user_id}}})
                await Cart.updateOne({user:user_id},{$set:{couponID:null,couponDiscount:0}})
              
              }
              CartData = await Cart.findOne({ user: user_id, 'products.product': ProductID })
            res.json({ stock, totalprice, ProductID, subtotal,subTotaldiscount,CartData,coupon })
        }
    } catch (err) {
        console.log(err);
    }
}
//////////////INCREMENT////////////////
const increment = async (req, res) => {
    try {
        console.log('fdgeuhfor');
        const user_id = req.session.user_id
        const ProductID = req.query.id
        const productData = await Product.findOne({ _id: ProductID })
        let CartData = await Cart.findOne({ user: user_id, 'products.product': ProductID })
        const pro_length = CartData.products.length

        // ///////
        let cartProductDatial = CartData.products.filter(value => {
            return value.product == ProductID
        })
        if (productData.stock <= cartProductDatial[0].stock) {
            res.json({ outOfStock: true })
        } else {



            await Cart.updateOne({ user: user_id, "products.product": ProductID }, { $inc: { 'products.$.stock': 1 } })
            CartData = await Cart.findOne({ user: user_id, 'products.product': ProductID })
            cartProductDatial = CartData.products.filter(value => {
                return value.product == ProductID
            })

            const price = productData.price
            const stock = cartProductDatial[0].stock
            const totaldiscount=stock*productData.discount
            const totalprice = price * stock
            await Cart.findOneAndUpdate({ user: user_id, 'products.product': ProductID }, { $set: { 
                'products.$.totalprice': totalprice,
                'products.$.totaldiscount': totaldiscount
         } })
            CartData = await Cart.findOne({ user: user_id, 'products.product': ProductID })
            const subtotal = CartData.products.map((value) => {
                return value.totalprice
            }).reduce((total, value) => {
                return total = total + value
            }, 0)

            const subTotaldiscount=CartData.products.map((value)=>{
                return value.totaldiscount
            }).reduce((total,value)=>{
                return total=total+value
            },0)
            const coupon=await Coupon.find({Maximumprice:{$lte:subtotal-subTotaldiscount},is_expire:true,'users.user':{$ne:user_id}})
            await Cart.updateOne({user:user_id},{$set:{grandtotal:subtotal,grandDiscount:subTotaldiscount}})
            res.json({ stock, totalprice, ProductID, subtotal,subTotaldiscount,coupon,CartData })
        }
    } catch (err) {
        console.log(err);
    }
}
////////////////////////DELETE CART////////////////
const deletecart=async(req,res)=>{
    try{
        const user_id=req.session.user_id
const ProductID=req.query.id
        await Cart.updateOne({user:user_id,'products.product':ProductID},{$pull:{products:{product:ProductID}}})
        res.json({success:true})
    }catch(err){
        console.log(err);
    }
}


const otpgenerater=()=>{
    let OTP=Math.random()*1000000
    OTP=Math.floor(OTP)
    return OTP
}

const profileEditOtpsend=async(req,res)=>{
    try{
        const user_id=req.session.user_id
        const user=await User.findOne({_id:user_id})
        console.log(user);
        const email=user.email

        const mailTransport=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:465,
            secure:true,
            auth:{
                user: 'malefashionfation@gmail.com',
                pass: "rrmxdmdwletsxrzs"
            }
        })
        let OTP=otpgenerater()
        const mailOption = {
            from: 'p7693088@gmail.com',
            to: email,
            subject: 'Email verifycation',
            html: `<p><a><h1>${OTP}<h1></a> this your profile edit Otp</p>`
        }
        mailTransport.sendMail(mailOption,(err)=>{
            if(err){
                console.log(err);
            }else{
                res.json({success:true})
            }
        })


       

    DDD(OTP)
    }catch(err){
        console.log(err);
    }
}

let otpS
function DDD(OTP) {
    otpS=OTP
    
}
const profileOtpVerify=async(req,res)=>{
    try{
const {otp} =req.body
      console.log(otp);
      console.log(otpS);
      console.log(otp==otpS);
        if(otp==otpS){
            res.json({success:true})
        }else{
         res.json({error:true})
        }
    }catch(err){
        console.log(err);
    }
}

/////SUBMIT EDIT DATA//////////
const submiteditedProfile=async (req,res)=>{
    try{
        const {name,mobile}=req.body
        const user=req.session.user_id
        const userData=await User.findByIdAndUpdate({_id:user},{$set:{
            name,
            mobile
        }})

        res.json({success:true})


    }catch(err){
        console.log(err);
    }
}
////////////////CHECK OUT PAGE RENDER/////////
const rendercheckout=async(req,res)=>{
    try{
        const index=req.query.index
        const user_id=req.session.user_id
        const CartData=await Cart.findOne({user:user_id}).populate('products.product')
        const subtotal = CartData.products.map((value) => {
            return value.totalprice
        }).reduce((total, value) => {
            return total = total + value
        }, 0)

        const subTotaldiscount=CartData.products.map((value)=>{
            return value.totaldiscount
        }).reduce((total,value)=>{
            return total=total+value
        },0)
        const user=await User.findOne({_id:user_id})
        const address=user.address[index]
        const order=await req.session.order
        req.session.order=null
        console.log(order);

        res.render('checkout',{x:req.session.user_id,CartData,subtotal,subTotaldiscount,address,index,order,user})
    }catch(err){
        console.log(err);
    }
}
////////////PRODUCT FILTER////////////////
const productfilter=async(req,res)=>{
    try{
        const {categorys,brands,search,filterprice}=req.body  
        console.log(filterprice);
        let product
        if(!search){
            if(filterprice[0]){
                if(filterprice.length==2){
                product=await Product.find({
                    $and:[
                    {price:{$lte:Number(filterprice[1])}},
                    {price:{$gte:Number(filterprice[0])}}
                ]
                    
                }).populate('category')
            }else{
                product=await Product.find({
                    $and:[
                    {price:{$gte:Number(filterprice[0])}}
                ]
                    
                }).populate('category')
            }
            }else{
                product=await Product.find({}).populate('category')
            }
        
        }else{
            product=await Product.find({
                $or:[
                {brand:{$regex:'.*'+search+'.*',$options:'i'}},
               { title:{$regex:'.*'+search+'.*',$options:'i'}}
                ]
            }).populate('category')
        }
        let products=[]
        let Data=[]
        let Categorys
        let Datas=[]
        console.log(search);
      console.log(categorys);
      console.log(brands);
// CATEGORY FILTER/////////////
    
       Categorys=categorys.filter((value)=>{
        return value!==null
       })
   
      if(Categorys[0]){
       
        Categorys.forEach((element,i) => {
            products[i]=product.filter((value)=>{
                return value.category.category==element
            })
          });
        //   console.log(products);
          products.forEach((value,i)=>{
             Data[i]=value.filter((v)=>{
                return v
            })
          })
          if(brands[0]){
            let c=0
            // console.log(categorys);
            brands.forEach((value,i)=>{
                Data.forEach((element)=>{
                   Datas[i]=element.filter((product)=>{
                   
                        return product.brand==value
                     })
                })
            })
            
          }
          Datas.forEach((value,i)=>{
            Data[i]=value
          })
      }else{
        if(brands[0]){
            brands.forEach((element,i) => {
              Data[i]=product.filter((value)=>{
                return value.brand==element
                })
            });
            if(categorys[0]){
                categorys.forEach((value,i)=>{
                    Data.forEach(element => {
                        Datas[i]=element.filter((product)=>{
                            return product.category.category==value
                        })
                    });
                })
            }
        }else{
            Data[0]=product
        }
       
        
      }
    
    //////////
      res.json({Data})
      
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    renderHome,
    renderLogin,
    renderRegister,
    veryfyRejister,
    Emailverify,
    verifyLogin,
    renderOtp,
    otpverify,
    renderOtpverify,
    otpsend,
    renderShop,
    renderProductDeatil
    , renderUserprofile,
    logout,
    renderaddAddress,
    addAddress,
    useraddress,
    editaddress,
    deleteAddress,
    CartRender,
    addCart,
    decrement,
    increment,
    profileEditOtpsend
,profileOtpVerify,
submiteditedProfile
,deletecart,
rendercheckout,
productfilter
}