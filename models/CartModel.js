const mongoose=require('mongoose')


const CartSchema=mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    products:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product'
        },
        stock:{
            type:Number,
            require:true,
            default:1
        },
        totalprice:{
            type:Number,
            require:true

        },
        color:{
            type:String,
            require:true
        },
        size:{
            type:String,
            require:true
        },
        totaldiscount:{
            type:Number,
            require:true
        }
 }
 ]

})
module.exports=mongoose.model('Cart',CartSchema)