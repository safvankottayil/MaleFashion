const mongoose=require('mongoose')

const categorySchema= mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    image:{
        type:Buffer,
        require:true
    }
})
 module.exports=mongoose.model("category",categorySchema)