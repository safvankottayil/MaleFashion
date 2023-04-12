const express=require('express')
const admin_router=express()


const config=require('../config/config')
const adminconstroller=require('../controllers/admincontrollers')
admin_router.set('views','./views/admin')
admin_router.use(express.static('./public'));
const upload=config.CategoryStrorge()
const prodectUplod=config.productStorage()
const adminAuth=require('../middlewere/adminAuth')
const couponControllers=require('../controllers/coupenContollers')

console.log('jdsgcdhkljhj');
admin_router.get('/login',adminAuth.isLogout,adminconstroller.RederLogin)
admin_router.post('/login',adminconstroller.AdminVerify)
admin_router.get('/',adminAuth.isAdmin,adminconstroller.renderDashbord)
admin_router.get('/user',adminAuth.isAdmin,adminconstroller.userRender)
admin_router.get('/user-block',adminAuth.isAdmin,adminconstroller.userBlock)
admin_router.get('/catgeroy',adminAuth.isAdmin,adminconstroller.renderCatgeory)
admin_router.get('/add-category',adminAuth.isAdmin,adminconstroller.renderAddCatgeory),
admin_router.post('/addCatgeory',upload.single('image'),adminconstroller.AddCatgeory)
admin_router.get('/category-edit',adminAuth.isAdmin,adminconstroller.renderEditCatgeory)
admin_router.post('/category-edit',upload.single('image'),adminconstroller.EditCatgeory)
admin_router.get('/category-delete',adminAuth.isAdmin,adminconstroller.DeleteCatgeory)
admin_router.get('/addProducts',adminAuth.isAdmin,adminconstroller.RenderProductlist)
admin_router.post('/product-list',prodectUplod.array('image',5),adminconstroller.insertProduct)
admin_router.get('/products',adminAuth.isAdmin,adminconstroller.RenderProduct)
admin_router.get('/product-unlist',adminAuth.isAdmin,adminconstroller.productUnlist)
admin_router.get('/products-edit',adminAuth.isAdmin,adminconstroller.productEditRender)
admin_router.post('/products-edit',prodectUplod.array('image',5),adminconstroller.prodectEdit)
admin_router.get('/logout',adminAuth.isAdmin,adminconstroller.adminLogout)

admin_router.get('/orderlists',adminAuth.isAdmin,adminconstroller.renderOrderlist)
admin_router.get('/orderviews',adminAuth.isAdmin,adminconstroller.renderOrderview)
admin_router.post('/orderedit',adminAuth.isAdmin,adminconstroller.orderStatusEdit)
////////////////////COUPEN////////////////////
admin_router.get('/coupon',adminAuth.isAdmin,couponControllers.renderCoupenpage)
admin_router.post('/add-coupon',adminAuth.isAdmin,couponControllers.addcoupon)
admin_router.post('/edit-coupon',adminAuth.isAdmin,couponControllers.editcoupon)
admin_router.get('/delete-coupon',adminAuth.isAdmin,couponControllers.deletecoupon)


module.exports=admin_router