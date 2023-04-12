const mongoose = require('mongoose')
const User = require('../models/usermodel')
const Cart = require('../models/CartModel')
const Product = require('../models/prodectModel')
const Order = require('../models/Ordermodel')
const Coupon = require('../models/CouponModel')
const crypto = require('crypto')
const { log } = require('console')
const { filter } = require('iter-ops')
const { ObjectId } = mongoose.Types


///////////// DATE EXPIRE///////////////////

/////////////render coupon page///////////////////
const renderCoupenpage = async (req, res) => {
    try {
        const CouponData = await Coupon.find()
        const datess = CouponData.map((value) => {
            return value.Exprice_date
        })
    
        const today = new Date()
    
        const Day = today.getDate()
        const month = today.getMonth() + 1
        const year = today.getFullYear()
        for(let i=0;i<datess.length;i++){
            const date = new Date(datess[i])
            let Eday = date.getDate()
            let Emonth = date.getMonth() + 1
            let Eyear = date.getFullYear()
            console.log(Number(year) <Number(Eyear));
            console.log(Number(month) < Number(Emonth));
            console.log(Number(Day) < Number(Eday));
            console.log(Eday,Emonth,Eyear,Day,month,year);
            if (Number(year) <Number(Eyear)) {
                await Coupon.updateOne({Exprice_date:datess[i]},{$set:{is_expire:true}})
            } else if (Number(month) < Number(Emonth)) {
               console.log('HKYKU');
                await Coupon.updateOne({Exprice_date:datess[i]},{$set:{is_expire:true}})
            } else if (Number(Day) < Number(Eday)) {
                console.log('ac');
             const x=   await Coupon.updateMany({Exprice_date:datess[i]},{$set:{is_expire:true}})
             console.log(x);
            } else{
                console.log('FEW');
              const X=  await Coupon.updateOne({Exprice_date:datess[i]},{$set:{is_expire:false}})
              console.log(X);
            }
        }
        const id = req.query.id
        let expireDate = []
        const Data = await Coupon.find()
        const dates = Data.map((value) => {
            return value.Exprice_date
        })

        dates.forEach((value, i) => {
            const date = new Date(value)
            let day = date.getDate()
            let month = date.getMonth() + 1
            if (day < 10) {
                day = '0' + day
            }
            if (month < 10) {
                month = '0' + Number(month)
            }
            expireDate[i] = date.getFullYear() + '-' + month + '-' + day
        })
        console.log(expireDate);
        res.render('coupon', { Data, expireDate, })

    } catch (err) {
        console.log(err);
    }
}
//////////////add coupon/////////////
const addcoupon = async (req, res) => {
    try {

        const { Code, Min, Max, Expire, Discount } = req.body
        const couponData = await Coupon.findOne({ code: Code })
        if (couponData) {
            res.json({ error: true })
        } else {
            await Coupon({
                code: Code,
                discount: Discount,
                Maximumprice: Max,
                Minimumprice: Min,
                Exprice_date: Math.floor(new Date(Expire).getTime())
            }).save()
            res.json({ success: true })
        }
    } catch (err) {
        console.log(err);
    }
}
/////////////////EDIT COUPON reder///////////////////
const editcoupon = async (req, res) => {
    try {

        console.log(req.body);
        const id = req.query.id
        const { code, discount, min, max, date } = req.body
        console.log(id);
        const couponData = await Coupon.findOne({ code: code })
        const singlecoupon = await Coupon.findOne({ _id: id })
        if (couponData && singlecoupon.code != code) {

        } else {

            const x = await Coupon.updateMany({ _id: id }, {
                $set: {
                    code: code,
                    discount: discount,
                    Maximumprice: max,
                    Minimumprice: min,
                    Exprice_date: Math.floor(new Date(date).getTime())
                }
            })
            res.redirect('/admin/coupon')
        }
    } catch (err) {
        console.log(err);
    }

}
//////////DELETE COUPON/////////////
const deletecoupon = async (req, res) => {
    try {
        const id = req.query.id
        await Coupon.deleteOne({ _id: id })
        res.redirect('/admin/coupon')
    } catch (err) {
        console.log(err);
    }
}






module.exports = {
    renderCoupenpage,
    addcoupon,
    editcoupon,
    deletecoupon
}