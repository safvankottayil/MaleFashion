
const Banner=require('../models/bannerModal')


const renderBanner=async(req,res)=>{
    try{
        const banner=await Banner.find()
        res.render('banner',{banner})

    }catch(err){
     console.log(err);   
    }
}
const renderaddBanner=async(req,res)=>{
    try{
        let banner
        console.log(req.query);
        if(req.query){
            banner=await Banner.findOne({_id:req.query.id}) 
        }
        console.log(banner);
        res.render('add_banner',{banner})
    }catch(err){
        console.log(err);
    }
}
const insertBanner=async(req,res)=>{
    try{
        console.log(req.body);
        const {title1,title2,description}=req.body
        const image =req.file.filename
       const banner= await Banner({
            title1,
            title2,
            description,
            image
        }).save()
    res.redirect('/admin/banner')

    }catch(err){
        console.log(err);
    }
}
const editbanner=async(req,res)=>{
    try{
console.log(23456789);
   console.log(req.body);
   const {title1,title2,description}=req.body
   const image=req.file.filename
   await Banner.updateOne({_id:req.query.id},{$set:{
    title1,title2,description,image
   }})
   res.redirect('/admin/banner')
    }catch(err){

    }
}
const renderaddsemibanner=async(req,res)=>{
    try{
        let banner
        if(req.query){
            banner=await Banner.findOne({_id:req.query.id}) 
        }
        console.log(banner);
        res.render('add_semibanner',{banner})


    }catch(err){
        console.log(err);
    }
}
const addSemibanner=async(req,res)=>{
    try{
        const {title1,title2,title3}=req.body
        let image=[]
        const bann=await Banner.findOne()
        for(let i=0;i<req.files.length;i++){
            image[i]=req.files[i].filename
        }
       const data= await Banner.updateOne({_id:bann._id},{$push:{semibanner:{
           title1,title2,title3,image 
        }}})
        console.log(data);
        res.redirect('/admin/banner')
        console.log(req.body);

    }catch(err){
        console.log(err);
    }
}
const deletesemibanner=async(req,res)=>{
    try{
       const data =await Banner.updateOne({'semibanner._id':req.query.id},{$pull:{semibanner:{_id:req.query.id}}})
       console.log(data)


    }catch(err){
        console.log(err);
    }
}
const editsemibanner=async(req,res)=>{
    try{
        console.log(req.body);
        const {title1,title2,title3}=req.body
        const id=req.query.id
        let image=[]
        for(let i=0;i<req.files.length;i++){
            image[i]=req.files[i].filename
        }
        const x=await Banner.updateOne({'semibanner._id':id},{$set:{
            'semibanner.$.title1':title1,
            'semibanner.$.title2':title2,
            'semibanner.$.title3':title3,
            'semibanner.$.image':image,
        }})
        console.log(x);
        res.redirect('/admin/banner')

    }catch(err){
        console.log(err);
    }
}
const bannerDelete=async(req,res)=>{
    try{
        console.log(req.qurey);
        const {id}=req.query
        await Banner.deleteOne({_id:id})
        res.redirect('/admin/banner')
    }catch(err){
        console.log(err);
    }
}

module.exports={
    renderBanner,
    renderaddBanner,
    renderaddsemibanner,
    insertBanner,
    editsemibanner,
    editbanner,
    deletesemibanner,
    addSemibanner,
    bannerDelete
}