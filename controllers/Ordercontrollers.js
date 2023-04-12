const mongoose = require('mongoose')
const User = require('../models/usermodel')
const Cart = require('../models/CartModel')
const Product = require('../models/prodectModel')
const Order = require('../models/Ordermodel')
const crypto = require('crypto')
const { log } = require('console')
const { filter } = require('iter-ops')
const { ObjectId } = mongoose.Types



let successData = []

//////ORDER INSERT CASH ON DELIVERY///////////////

const insertOrder = async (req, res) => {
    try {
        const user_id = req.session.user_id
        const today = new Date()
        const day = today.getDate()
        const month = today.getMonth() + 1
        const year = today.getFullYear()
        // const hours=today.getHours()
        // const minit=today.getMinutes()
        // const second=today.getSeconds()
        const time = new Date()
        const userData = await User.findOne({ _id: user_id })
        const cartData = await Cart.findOne({ user: user_id })
        const orderData = await Order.findOne({ user: user_id })
        const index = req.query.index
        const length = cartData.products.length




        if (!orderData) {
            console.log('success');
            const order = await Order({
                user: user_id
            }).save()
            let order_uuid = crypto.randomBytes(16).toString('hex')
            cartData.products.forEach(async (element, i) => {

                let uuid = crypto.randomBytes(16).toString('hex')
                await Order.findOneAndUpdate({ user: user_id }, {
                    $push: {
                        order: {
                            order_hash: order_uuid,
                            id: uuid,
                            product_id: element.product,
                            quantity: element.stock,
                            size: element.size,
                            totalprice: element.totalprice,
                            totaldiscount: element.totaldiscount,
                            address: userData.address[index],
                            payment_type: 'Cash on delivery',
                            date: `${day}-${month}-${year}`,
                            arrive_date: `${day + 5}-${month}-${year}`,
                            time: time


                        }
                    }
                })
             const product= await Product.findOne({_id:element.product})
             await Product.updateOne({_id:element.product},{$set:{stock:product.stock-element.stock}})

                await Cart.updateOne({ user: user_id }, { $pull: { 'products': { _id: element._id } } })
               

            });
            res.redirect('/orsersuccess?orderhashID=' + order_uuid)

        } else {
            let order_uuid = crypto.randomBytes(16).toString('hex')
            cartData.products.forEach(async (element, i) => {

                let uuid = crypto.randomBytes(16).toString('hex')
                await Order.updateOne({ user: user_id }, {
                    $push: {
                        order: {
                            order_hash: order_uuid,
                            id: uuid,
                            product_id: element.product,
                            quantity: element.stock,
                            size: element.size,
                            totalprice: element.totalprice,
                            totaldiscount: element.totaldiscount,
                            address: userData.address[index],
                            payment_type: 'Cash on delivery',
                            date: `${day}-${month}-${year}`,
                            arrive_date: `${day + 5}-${month}-${year}`,
                            time: time

                        }
                    }
                })
                const product= await Product.findOne({_id:element.product})
                await Product.updateOne({_id:element.product},{$set:{stock:product.stock-element.stock}})
                await Cart.updateOne({ user: user_id }, { $pull: { 'products': { _id: element._id } } })

            });

            res.redirect('/orsersuccess?orderhashID=' + order_uuid)
        }

    } catch (err) {
        console.log(err);
    }
}
// /////////////////ORDER SUCCESS PAGE/////////////
const ordersuccesspage = async (req, res) => {
    try {

        const user_id = req.session.user_id
        const order_hash = req.query.orderhashID
        const orderData = await Order.findOne({ user: user_id }).populate('order.product_id')
        console.log(orderData, "ghjkhljhl");
        const Data = orderData.order.filter((value) => {
           return value.order_hash == order_hash
        })
        const totalprice = await Data.map(element => {
            return element.totalprice
        })
            .reduce((total, value) => {
                return total = total + value
            }, 0)
        const totaldiscount = Data.map(element => {
            return element.totaldiscount
        })
            .reduce((total, value) => {
                return total = total + value
            }, 0)
        const subtotalprice = await totalprice - totaldiscount
        await res.render('Ordersuccess', { x: req.session.user_id, Data, subtotalprice })
    } catch (err) {
        console.log(err);
    }
}

//////////////////ORDER CANSELL//////////////
const oredercancel = async (req, res) => {
    try {
        const today = new Date()
        const day = today.getDate()
        const month = today.getMonth() + 1
        const year = today.getFullYear()
        const orderview=req.query.orderview
        const user_id = req.session.user_id
        const order_hash = req.query.orderhashID
        const order = await Order.findOne({ user: user_id }).populate('order.product_id')
        let successOrderData = order.order.filter((value) => {
            return value.order_hash == order_hash
        })
        let quantitys=successOrderData.map((value)=>{
            return value.quantity
        })
        let productId=successOrderData.map((value)=>{
            return value.product_id._id
        })
        console.log(productId);
        successOrderData.forEach(async(element,i) => {
            await Order.updateOne({ user: user_id, 'order.id': element.id }, { $set: { 'order.$.status': 'cancelled','order.$.arrive_date':`${day}-${month}-${year}` } })
            const product= await Product.findOne({_id:productId[i]})
           console.log(quantitys)
           console.log(product.stock);
            await Product.updateOne({_id:productId[i]},{$set:{stock:quantitys[i]+product.stock}})

            
        })
        if(orderview){
            res.redirect('/orderview?orderHash=' + order_hash)
        }else{
            res.redirect('/orsersuccess?orderhashID=' + order_hash)
        }
       


    } catch (err) {
        console.log(err);
    }
}
///////////////////RENDER ORDER LIST ////////////////////
const renderOrderlist = async (req, res) => {
    try {
        const user_id = req.session.user_id
        let Data = []
        const order = await Order.findOne({ user: user_id }).populate('order.product_id')
        const order_hashID = order.order.map((value) =>  value.order_hash )

        let orderhashIDs = [...new Set(order_hashID)]
        orderhashIDs.forEach((element, i) => {
            Data[i] = order.order.filter((value) => {
                return value.order_hash == element
            })
        })
        if (Data) {
            res.render('order_list', { x: req.session.user_id, Data })
        }
    } catch (err) {
        console.log(err);
    }
}
/////////////////////ORDER VIEW////////////////////
const renderorderview = async (req, res) => {
    try {
        const user_id = req.session.user_id
        const order_hashID = req.query.orderHash
        const order = await Order.findOne({ user: user_id }).populate('order.product_id')
        const Data = order.order.filter((value) => {
           return value.order_hash == order_hashID
        })
        const totalprice = Data.map(element => {
           return element.totalprice
        })
            .reduce((total, value) => {
                return total = total + value
            }, 0)
        const totaldiscount = Data.map(element => {
            return element.totaldiscount
        })
            .reduce((total, value) => {
                return total = total + value
            }, 0)
        const subtotalprice = totalprice - totaldiscount

        console.log(Data);
        await res.render('orderview', { x: user_id, Data, subtotalprice })
    } catch (err) {
        console.log(err);
    }
}
module.exports = {
    insertOrder,
    ordersuccesspage,
    oredercancel,
    renderOrderlist,
    renderorderview
}