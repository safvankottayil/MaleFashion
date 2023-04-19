const Product=require('../models/prodectModel')
const User=require('../models/usermodel')
const Review=require('../models/reviewModel')

const productReview=async(req,res)=>{
    try{
        const {rating,description,ID}=req.body
        const user_id=req.session.user_id
        const review=await Review.findOne({product:ID})
        if(review){
            await Review.updateOne({product:ID},{$push:{reviews:{
                user:user_id,
                description:description,
                rating:rating
            }},$set:{rating:review.rating+rating}})
        }else{
            await Review({
                product:ID,
                rating:rating,
                'reviews.0.user':user_id,
                'reviews.0.description':description,
                'reviews.0.rating':rating
            }).save()
        }
        res.json({success:true})

    }catch(err){
        console.log(err);
    }
}
const reviewlike=async(req,res)=>{
    try{
        console.log(1323);
        const {user_id,productID}=req.query
        const user=req.session.user_id
        console.log(req.query);
        let review=await Review.findOne({product:productID})
        let thisreview=review.reviews.filter((value)=>{
            return value.user.equals(user_id)
        })
        let userliked=review.likes.filter((value)=>{
            return value.reviewOwner.equals(user_id)&&value.user.equals(user)
        })
        console.log(userliked);
        
        if(userliked[0]){
            await Review.updateOne({product:productID,'reviews.user':user_id},{$set:{
                'reviews.$.like':thisreview[0].like+1,
                'reviews.$.dislike':thisreview[0].dislike-1,
            }})
            await Review.updateOne({product:productID,'likes._id':userliked[0]._id},{$set:{'likes.$.like':true,'likes.$.dislike':false}})
          

        }else{
            await Review.updateOne({product:productID},{$push:{likes:{
                reviewOwner:user_id,
                user:user,
                like:true,
                dislike:false
            }}})
            await Review.updateOne({product:productID,'reviews.user':user_id},{$set:{'reviews.$.like':thisreview[0].like+1}})
        }
        review=await Review.findOne({product:productID})
        console.log(review);
        thisreview=review.reviews.filter((value)=>{
            return value.user.equals(user_id)
        })
        userliked=review.likes.filter((value)=>{
            return value.reviewOwner.equals(user_id)&&value.user.equals(user)
        })

        const like=thisreview[0].like
        const dislike=thisreview[0].dislike
        const liketrue=userliked[0].like
        const disliketrue=userliked[0].dislike
        console.log(like);
        console.log(dislike);
        console.log(liketrue);
        console.log(disliketrue);
        res.json({like,dislike,liketrue,disliketrue})

    }catch(err){
        console.log(err);
    }
}

const reviewdislike=async(req,res)=>{
    try{
        console.log(1323);
        const {user_id,productID}=req.query
        const user=req.session.user_id
        console.log(req.query);
        let review=await Review.findOne({product:productID})
        let thisreview=review.reviews.filter((value)=>{
            return value.user.equals(user_id)
        })
        let userliked=review.likes.filter((value)=>{
            return value.reviewOwner.equals(user_id)&&value.user.equals(user)
        })
        
        
        if(userliked[0]){
            await Review.updateOne({product:productID,'reviews.user':user_id},{$set:{
                'reviews.$.dislike':thisreview[0].dislike+1,
                'reviews.$.like':thisreview[0].like-1,
            }})
            await Review.updateOne({product:productID,'likes._id':userliked[0]._id},{$set:{'likes.$.dislike':true,'likes.$.like':false}})
            const x=  await Review.findOne({product:productID,'likes._id':userliked[0]._id})
            console.log(x);
        }else{
            await Review.updateOne({product:productID},{$push:{likes:{
                reviewOwner:user_id,
                user:user,
                dislike:true,
                like:false
            }}})
            await Review.updateOne({product:productID,'reviews.user':user_id},{$set:{'reviews.$.dislike':thisreview[0].dislike+1}})
        }
        review=await Review.findOne({product:productID})
        // console.log(review);
        thisreview=review.reviews.filter((value)=>{
            return value.user.equals(user_id)
        })
        userliked=review.likes.filter((value)=>{
            return value.reviewOwner.equals(user_id)&&value.user.equals(user)
        })

        const like=thisreview[0].like
        const dislike=thisreview[0].dislike
        const liketrue=userliked[0].like
        const disliketrue=userliked[0].dislike
       
        res.json({like,dislike,liketrue,disliketrue})

    }catch(err){
        console.log(err);
    }
}

module.exports={
    productReview,
    reviewlike,
    reviewdislike
}