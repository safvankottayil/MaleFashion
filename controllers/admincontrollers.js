
const User = require("../models/usermodel")
const Catgeory = require('../models/categoryModel')
const Product = require('../models/prodectModel')
const Order = require('../models/Ordermodel')
const bcrypt = require('bcrypt')
const { all } = require("../router/userRouter")
let message
let totalrevenue


////////////RENDER DASHBORD
const renderDashbord = async (req, res) => {
    try {
        const users=await User.find().count()
        const user=await User.find().limit(3)
        const products=await Product.find().count()
        const order=await Order.find()
        let profit=0
        let totalrevenue=0
        let showorders=[]
        let Graf=[]
        let Data=[],i=0,k=0
       order.forEach((value)=>{
        value.order.forEach((element)=>{
            Data[i]=element
            i++
        })
       })
       const data=Data.reverse()
       if(data.length>5){
       for(let n=0;n<5;n++){
        showorders[k]=data[n]
        k++
       }
       k=0
    }else{
        for(let n=0;n<data.length;n++){
            showorders[k]=data[n]
            k++
           }
           k=0
    }

       console.log(showorders);
      const pending= Data.filter((value)=>{
        return value.status=='pending'
       }).length
       const delivered=Data.filter((value)=>{
        return value.status=='delivered'
       }).length
       const cancelled=Data.filter((value)=>{
        return value.status=='cancelled'
       }).length
       const ontheway=Data.filter((value)=>{
        return value.status=='on the way'
       }).length
       const returned=Data.filter((value)=>{
        return value.status=='returned'
       }).length
      
       let orderstatus=[cancelled,ontheway,pending,delivered,returned]
       console.log(orderstatus);

       if(delivered!=0){
        let Delivered=[],j=0
        const today=new Date()
        const delivered=Data.filter((value)=>{
            return value.status=='delivered'
           })
           delivered.forEach((value)=>{
            let lastdate=new Date(value.arrive_date)
            if(today>=lastdate){
                Delivered[j]=value
                j++
                totalrevenue+=value.totalprice-value.totaldiscount
                profit+=(value.totalprice-value.totaldiscount)*1/5
            }
           }) 
           console.log(Delivered);
        const date= Delivered.map((value)=>{

            return value.month
         })
         console.log(date);
         let months=[]

         const month=[...new Set(date)]
         month.forEach((value,i)=>{
            let profit=0
            let revenue=0
          Delivered.forEach((element)=>{
            if(value==element.month){
                console.log(element.totalprice-element.totaldiscount);
                console.log((element.totalprice-element.totaldiscount)*1/5);
                revenue+=element.totalprice-element.totaldiscount
                profit+=(element.totalprice-element.totaldiscount)*1/5
                Graf[i]={x:value,profit:profit,revenue:revenue}
            }
            })
         })
           }
           
       


        console.log(123);
        console.log(showorders);
        

        res.render('dashbord',{users,products,profit,totalrevenue,user,showorders,Graf,orderstatus})

    } catch (err) {
        console.log(err);
    }
}

///////////RENDER LOGIN//////////
const RederLogin = async (req, res) => {
    try {
        res.render('adminLogin')
        //  res.render('Dash')
    } catch (err) {
        console.log(err);
    }
}
///////////////ADMIN VERIFY/////////////
const AdminVerify = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body
        const AdminData = await User.findOne({ email: email })

        if (AdminData) {
            const chek = await bcrypt.compare(password, AdminData.password)
            if (chek) {
                if (AdminData.is_admin) {
                    req.session.admin_id = AdminData._id
                    res.json({ success: true })
                } else {
                    res.json({ emailError: 'Admin only access', passwordError: '' })

                }
            } else {
                console.log('jdsds');
                res.json({ passwordError: 'Password requred', emailError: '' })

            }

        } else {
            res.json({
                emailError: 'Email required',
                passwordError: 'Password requred'
            })
        }


    } catch (err) {

    }
}
////////////////USER DEATEL PAGE RENDER//////////////////////////
const userRender = async (req, res) => {
    try {
        const userData = await User.find({ status: true })
        console.log(userData);
        res.render('user_list', { userData })
    } catch (err) {
        console.log(err);
    }
}
///////////////////USER BLOCK/////////////////////
const userBlock = async (req, res) => {
    try {
        console.log(req.query);
        const data = req.query.id
        const userData = await User.findById({ _id: data })
        if (userData.is_blocked) {
            await User.updateOne({ _id: req.query.id }, { $set: { is_blocked: false } })
            res.redirect('/admin/user')
        } else {
            await User.updateOne({ _id: req.query.id }, { $set: { is_blocked: true } })
            res.redirect('/admin/user')
        }

    } catch (err) {
        console.log(err);
    }
}
//////////////RENDER CATEGORY PAGE/////////////////

const renderCatgeory = async (req, res) => {
    try {
        const CatgeoryData = await Catgeory.find()
        res.render('category', { CatgeoryData })
    } catch (err) {
        console.log(err);
    }
}
/////////////RENDER ADD CATEGORY PAGE///////////////////////
const renderAddCatgeory = async (req, res) => {
    try {

        res.render('AddCatgeory', { message })
    } catch (err) {
        console.log(err);
    }
}
/////////////////ADD CATEGPORY/////////////////
const AddCatgeory = async (req, res) => {
    try {
        const name = req.body.Catgeoryname
        const Data = await Catgeory.findOne({ category: name })
        console.log(Data);
        if (Data) {
            message = 'this category Alredy exist'
            res.redirect('/admin/add-category')
        } else {
            const categoryData = await Catgeory({
                category: req.body.Catgeoryname,
                image: req.file.filename
            })
            console.log(categoryData);
            Catgeory.create(categoryData)
            if (categoryData) {
                res.redirect('/admin/catgeroy')
            }
        }
    } catch (err) {
        console.log(err);
    }
}
///////////////RENDER EDIT CATEGORY PAGE RENDER///////////////////////
const renderEditCatgeory = async (req, res) => {
    try {
        const data = req.query.id
        console.log(req.query.id);
        const categoryData = await Catgeory.findById({ _id: data })
        res.render('category_edit', { categoryData })
    } catch (err) {
        console.log(err);
    }
}
/////////////EDIT CATEGORY///////////////
const EditCatgeory = async (req, res) => {
    try {
        const image = req.file.filename
        const categoryName = req.body.CatgeoryName
        const ID = req.query.id
        await Catgeory.findByIdAndUpdate({ _id: ID }, { $set: { category: categoryName, image: image } })
        res.redirect('/admin/catgeroy')

    } catch (err) {
        console.log();
    }
}
///////////DELETE CATEGERY/////////////
const DeleteCatgeory = async (req, res) => {
    try {
        console.log(req.query);

        const ID = req.query.id
        const Data = await Product.findOne({ category: ID })
        console.log(Data);
        if (Data) {
            res.json({ success: true })
            console.log('jodsgsgcvd');
        } else {
            console.log('ghasg');
            await Catgeory.findByIdAndDelete({ _id: ID })
            res.json({ Delete: true })
        }

    } catch (err) {
        console.log(err);
    }
}
////////////////RENDER ADD PRDUCT PAGE////////////////////
const RenderProductlist = async (req, res) => {
    try {
        const categoryData = await Catgeory.find()
        console.log(categoryData);
        res.render('Products_list', { Data: categoryData })

    } catch (err) {
        console.log(err);
    }
}
/////////////INSERT PRODUCT/////////////////
const insertProduct = async (req, res) => {
    try {
        let image = []
        for (let i = 0; i <req.files.length; i++) {
            image[i] = req.files[i].filename
        }
        console.log(req.body);
        const { title, brand, price, stock, discount, category, description, size, color } = req.body
        console.log(req.body);

        const CategoryData = await Catgeory.findOne({ category: category })

        const productData = await Product({
            title: title,
            brand: brand,
            price: price,
            stock: stock,
            discount: discount,
            description: description,
            image: image,
            category: CategoryData._id,
            size: size,
            color: color
        })
        Product.create(productData)
        console.log('success');
        res.redirect('/admin/products')

    } catch (err) {
        console.log(err);
    }
}
////////////////RENDER PRODUCT PAGE///////////////////
const RenderProduct = async (req, res) => {
    try {
        const productData = await Product.find().populate('category')

        res.render('Product', { Data: productData })
    } catch (err) {
        console.log(err);
    }
}
////////// PRODUCT LIST AND UNLIST//////////////////
const productUnlist = async (req, res) => {
    try {
        const ID = req.query.id
        const Data = await Product.findById({ _id: ID })
        if (Data.status) {
            await Product.findByIdAndUpdate({ _id: ID }, { $set: { status: false } })
            res.redirect('/admin/products')
        } else {
            await Product.findByIdAndUpdate({ _id: ID }, { $set: { status: true } })
            res.redirect('/admin/products')
        }

    } catch (err) {
        console.log(err);
    }
}
///////////////RENDER PRODUCT PAGE //////////////////////
const productEditRender = async (req, res) => {
    try {
        const ID = req.query.id
        const Data = await Catgeory.find()
        const ProductData = await Product.findById({ _id: ID })
        res.render('product_edit', { Data, ProductData })
    } catch (err) {
        console.log(err);
    }
}
//////////////////EDIT PRODUCT/////////////////
const prodectEdit = async (req, res) => {
    try {
        const ID = req.query.id
        const { title, brand, price, stock, discount, category, description, size, color } = req.body
        const Data = await Catgeory.find({ category: category })
        let image = []
        for (let i = 0; i < req.files.length; i++) {
            image[i] = req.files[i].filename
        }

    const x= await Product.updateOne({ _id: ID }, {
            $set: {
                title,
                brand,
                price,
                stock,
                discount,
                category: Data._id,
                description,
                image,
                size,
                color

            }
        })
        console.log(x);
        res.redirect('/admin/products')
    } catch (err) {
        console.log(err);
    }
}
//////////////////ADMIN LOGOUT//////////////////////
const adminLogout = async (req, res) => {
    try {
        req.session.admin_id = null
        res.redirect('/admin/logout')

    } catch (err) {
        console.log(err);
    }
}

////////////////////ORDERLIST RENDER///////////////
const renderOrderlist = async (req, res) => {
    try {
        const order = await Order.find().populate('order.product_id')
        // console.log(order);
        let order_hashID
        let allorders = []
        let n = 0
        order.forEach((id) => {
            id.order.forEach((value, i) => {
                allorders[n] =value
                n++
            })
        })
        n = 0

        order_hashID = allorders.map((value) => {
            return value.order_hash
        })
        order_hashID = [...new Set(order_hashID)]
        let groupOrders=[]
        order_hashID.forEach((element,i)=>{
            allorders[i]= allorders.filter((value)=>{
                return  value.order_hash==element
            })
        })
    

        allorders=allorders.reverse()
        console.log(req.query);
        if(req.query.type){
            if(req.query.type=='all'){
                groupOrders=allorders
                
            }else if(req.query.type=='pending'){
                let i=0
                allorders.forEach((element)=>{
                groupOrders[i]=element.filter((value)=>{
                     if(value.status=='pending'){
                        i++
                        return value.status=='pending'
                        
                     }
                })
            })
            }else if(req.query.type=='ontheway'){
                let i=0
                allorders.forEach((element)=>{
                    groupOrders[i]=element.filter((value)=>{
                   if(value.status=='on the way'){
                    i++
                    return value.status=='on the way'
                   }
                })
            })
            }else if(req.query.type=='delivered'){
                let i=0
                allorders.forEach((element)=>{
                    groupOrders[i]=element.filter((value)=>{
                    if(value.status=='delivered'){
                        i++
                    return value.status=='delivered'
                    }
                })
            })
            }else if(req.query.type=='cancelled'){
                let i=0
                allorders.forEach((element)=>{
                    groupOrders[i]=element.filter((value)=>{
                    if(value.status=='cancelled'){
                        i++
                    return value.status=='cancelled'
                    
                    }
                })
            })
            }else if(req.query.type=='returned'){
                let i=0
                allorders.forEach((element)=>{
                    groupOrders[i]=element.filter((value)=>{
                    if(value.status=='returned'){
                        i++
                    return value.status=='returned'
                    }
                })
            })
            }

           res.render('order_list',{groupOrders})
        }else{
            groupOrders=allorders
            console.log(groupOrders);
            res.render('order_list',{groupOrders})
        }
     
    } catch (err) {
        console.log(err);
    }
}

///////////////////////////ORDER VIEW RENDWR///////////
const renderOrderview=async(req,res)=>{
    try{
        const order_id=req.query.orderHash
        const order=await Order.find().populate('order.product_id')
        let n=0
        let allorder=[]
        order.forEach((element)=>{
            element.order.forEach((value)=>{
               allorder[n]=value
               n++
            })
        })
        n=0
        
        const orderDetail=allorder.filter((value)=>{
            return value.order_hash==order_id
        })
        console.log(orderDetail);

        await res.render('orderview',{orderDetail})
    }catch(err){
        console.log(err);
    }
}
/////////////////////////edit order pending/////////////
const orderStatusEdit=async(req,res)=>{
    try{
        const today = new Date()
        const day = today.getDate()
        const month = today.getMonth() + 1
        const year = today.getFullYear()
        const order_hash=req.query.HashID
        console.log(req.query);
        const type=req.query.type
        const order=await Order.findOne({'order.order_hash':order_hash}).populate('order.product_id')
        let successOrderData=order.order.filter((value)=>{
            return value.order_hash==order_hash
        })
        if(type=='pending'){
        successOrderData.forEach(async(element)=>{
            await Order.updateOne({'order.id':element.id},{$set:{'order.$.status':'pending'}})
        })
    }else if(type=='ontheway'){
        successOrderData.forEach(async(element)=>{
            await Order.updateOne({'order.id':element.id},{$set:{'order.$.status':'on the way'}})
        })
    }else if(type=='delivered'){
const days=5
const day=new Date(Date.now()+(days*3600 * 1000 * 24))
        successOrderData.forEach(async(element)=>{
            await Order.updateOne({'order.id':element.id},{$set:{'order.$.status':'delivered','order.$.arrive_date':day}})
        })
    }else if(type=='cancelled'){
        successOrderData.forEach(async(element)=>{
            await Order.updateOne({'order.id':element.id},{$set:{'order.$.status':'cancelled','order.$.arrive_date':`${day}-${month}-${year}`}})
        })
    }
        res.json({success:true})
    }catch(err){
        console.log(err);
    }
}
module.exports = {
    renderDashbord,
    userRender,
    userBlock,
    renderCatgeory,
    AddCatgeory,
    renderAddCatgeory,
    renderEditCatgeory,
    EditCatgeory,
    DeleteCatgeory,
    RenderProductlist,
    insertProduct,
    RenderProduct,
    productUnlist,
    productEditRender,
    prodectEdit,
    RederLogin,
    AdminVerify,
    adminLogout,
    renderOrderlist,
    renderOrderview,
    orderStatusEdit
    

}
