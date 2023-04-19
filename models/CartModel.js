const mongoose = require('mongoose')


const CartSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    grandtotal: {
        type: Number,
        require: true
    },
    grandDiscount: {
        type: Number,
        require: true
    },
    couponDiscount:{
        type:Number,
        require:true,
        default:0
    },
    couponID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'coupon'
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        stock: {
            type: Number,
            require: true,
            default: 1
        },
        totalprice: {
            type: Number,
            require: true

        },
        color: {
            type: String,
            require: true
        },
        size: {
            type: String,
            require: true
        },
        totaldiscount: {
            type: Number,
            require: true
        }
    }
    ]

})
module.exports = mongoose.model('Cart', CartSchema)