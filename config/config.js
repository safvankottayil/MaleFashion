const mongoose = require('mongoose')
const multer=require('multer')

///mongoose conncetion
function mongooseConnection() {
    mongoose.set('strictQuery', false)
    mongoose.connect('mongodb://127.0.0.1:27017/Ecommerce')
}

////CATEGORY STORAGE///
function CategoryStrorge(){
    const Catgeorystorage = multer.diskStorage({
        destination:(req,file,callback)=>{
        callback(null,'./public/catgoery')
        },
        filename:(req,file,callback)=>{
            const name = Date.now()+'-'+file.originalname;
            callback(null,name)
        }
    });

    const upload=multer({storage:Catgeorystorage})
    return upload
}

//////PRODUCT STORAGE//////
 function productStorage(){
    const prodectStorage=multer.diskStorage({
        destination:(req,file,callback)=>{
            callback(null,'./public/product')
        },
        filename:(req,file,callback)=>{
            const name=Date.now()+'-'+file.originalname;
            callback(null,name)
        }
    })

    const prodectUplod=multer({storage:prodectStorage})
    // .fields([{name:'document',maxCount:1},{name:'image',maxCount:1}]);
 return prodectUplod
 }

module.exports = {
    mongooseConnection,
    CategoryStrorge,
    productStorage
}