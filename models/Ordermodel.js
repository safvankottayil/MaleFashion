const { hash } = require('bcrypt')
const mongoose=require('mongoose')

const orderShema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    order:[{
        order_hash:{
            type:String,
            require:true
        },
        id:{
            type:String,
            require:true
        },
        product_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product'
        },
        quantity:{
            type:Number,
            require:true
        }
        ,
        size:{
            type:String,
            require:true
        },
        totalprice:{
            type:Number,
            require:true
        },
        totaldiscount:{
            type:Number,
            require:true
        }
        ,
        address:{
            type:Object,
            require:true
        },
        status:{
            type:String,
            require:true,
            default:'pending'
        },
        payment_type:{
            type:String,
            require:true
        },
        date:{
            type:String,
            require:true,
            
        },
        arrive_date:{
            type:String,
            require:true,
        },time:{
            type:Date,
            require:true
            
        },
        month:{
            type:Number,
            require:true
        }

    }]
})
module.exports=mongoose.model('order',orderShema)