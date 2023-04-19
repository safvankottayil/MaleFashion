const { data } = require('jquery');
const Order=require('../models/Ordermodel')
const excelJS=require('exceljs')



const renderSalespage=async(req,res)=>{
    try{
        console.log(req.body);
        let {first,last}=req.body
        const today=new Date()
        const order=await Order.find({}).populate('order.product_id')
        let filterData=[],Data=[],i=0

        order.forEach(element => {
            element.order.forEach((value)=>{
              Data[i]=value
              i++
            })
        });
        i=0
        if(first){
            Data.forEach((value)=>{
                if(value.status=='delivered'){
                    if(new Date(value.arrive_date)<=today){
                        first=new Date(first)
                        last=new Date(last)
                        let date=value.date.split('-')
                        if(date[0].length==1){
                            date[0]=0+date[0]
                        }
                        if(date[1].length==1){
                            date[1]=0+date[1]
                        }
                        date=date.reverse().join('-')
                        if(first<=new Date(date)&&last>=new Date(date)){
                            filterData[i]=value
                            i++
                        }
                    }
                }
            })
            req.session.filterorder=null
            req.session.filterorder=filterData
            res.render('sales',{filterData})
        }else{
        Data.forEach((value)=>{
            if(value.status=='delivered'){
                if(new Date(value.arrive_date)<=today){
                    filterData[i]=value
               i++
        }
            }
        })
        req.session.filterorder=null
        req.session.filterorder=filterData
        res.render('sales',{filterData})
    }
    }catch(err){
        console.log(err);
    }
}
const convertExcelsheet=async(req,res)=>{
    try{
     const Workbook=new excelJS.Workbook()
     const Worksheet= Workbook.addWorksheet('My Sales')

     Worksheet.columns=[
        {header:'No',key:'no'},
        {header:'Name',key:'name'},
        {header:'Product',key:'Product'},
        {header:'Date',key:'date'},
        {header:'Price',key:'price'}
     ]
     let count=1
       const Data= req.session.filterorder
       Data.forEach((value)=>{
        console.log(value.product_id.title);
        Worksheet.addRow({
            no:count,
            name:value.address.name,
            Product:value.product_id.title,
            date:value.date,
            price:value.totalprice-value.totaldiscount
        })
        count++
       })
       Worksheet.getRow(1).eachCell((cell)=>{
        cell.font={bold:true}
       })
       res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
       )
       res.setHeader(
        "Content-Disposition",'attachment; filename=users.xlsx'
       )
       return Workbook.xlsx.write(res)
    }catch(err){
        console.log(err);
    }
}

module.exports={
    renderSalespage,
    convertExcelsheet
}