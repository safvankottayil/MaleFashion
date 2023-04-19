const mongoose = require('mongoose')
const User = require('../models/usermodel')
const Cart = require('../models/CartModel')
const Product = require('../models/prodectModel')
const Order = require('../models/Ordermodel')
const Coupon = require('../models/CouponModel')
const { updateOne, findOne } = require('../models/usermodel')

////////////////WHISH LIST RENDER//////////////////
const renderwishlist = async (req, res) => {
    try {
        const { id } = req.query
        const user_id = req.session.user_id

        if (id) {
            const product = await Product.findOne({ _id: id })
            const user = await User.findOne({ _id: user_id, 'wishlist.product': id })
            console.log(user);
            if (user) {
                res.redirect('/wishlist')
            } else {
                await User.updateOne({ _id: user_id }, { $push: { wishlist: { product: product._id } } })
            }

        }
        const user = await User.findOne({ _id: user_id }).populate('wishlist.product')
        console.log(user);
        const wishlist = user.wishlist.filter((element, i) => {
            return element
        });

        if (wishlist[0]) {
            res.render('wishlist', { x: req.session.user_id, wishlist })
        } else {
            res.send('dmckdecrjrdnfcrjdnfj')
        }

    } catch (err) {
        console.log(err);
    }
}
/////////////////WISH LIST DELETE/////////
const deleteWishlist = async (req, res) => {
    try {
        const id = req.query.id
        const user_id = req.session.user_id
        console.log(req.query);
        const x = await User.updateOne({ _id: user_id, 'wishlist._id': id }, { $pull: { 'wishlist': { _id: id } } })
        console.log(x);
        res.redirect('/wishlist')
    } catch (err) {
        console.log(err);
    }
}
module.exports = {
    renderwishlist,
    deleteWishlist
}