const mongoose=require("mongoose")
const Address=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mobile1:{
        type:Number,
        required:true
    },
    mobile2:{
        type:Number,
        required:true
    },
    pincode:{
            type:Number,
            required:true
    },
    loaction1:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    landmark:{
        type:String,
        required:true
    },
    addressType:{
        type:String,
        required:true
    }
})


const userData=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        requied:true
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    },
    address:[Address],

    is_verfyed:{
        type:Boolean,
        required:true
    }
    ,
    is_admin:{
        type:Boolean,
        requied:true,
        default:false
    }
    ,is_blocked:{
        type:Boolean,
        requied:true,
        default:false

    }
})

module.exports=mongoose.model("user",userData)