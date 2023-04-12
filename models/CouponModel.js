const mongoose=require('mongoose')

const couponshema=mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    Maximumprice:{
        type:Number,
        require:true
    },
    Minimumprice:{
        type:Number,
        required:true,
    },
    Exprice_date:{
        type:Date,
        require:true
    },
    is_expire:{
        type:Boolean,
        require:true,
        default:false
    }
})

module.exports=mongoose.model('coupon',couponshema)