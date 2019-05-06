const express=require('express')
const app=express()
const morgan=require('morgan')
const mongoose=require('mongoose')
const bodyParse=require('body-parser')
const productRouter=require('./api/routes/product')
const orderRouter=require('./api/routes/order')
const singupRouter=require('./api/routes/user')

mongoose.connect("mongodb+srv://mangodb username:"+process.env.MONGO_ATLAS_PW+"@cluster0-66r7n.mongodb.net/db name", { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('Sucessfully connected')
    } else {
        console.log("Error in Db Connection" + err)
    }
});
app.use(morgan('dev'))
app.set('view engine','ejs')
app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json())
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Request-With-Content-type,Accept,Authorization');
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,GET,POST,PATCH,DELETE')
        return res.status(200).json({})
    }
    next()
})
app.use(express.static('public'));
app.use('/products',productRouter)
app.use('/order',orderRouter)
app.use('/user',singupRouter)
app.use('/uploads/',express.static('uploads'))
app.use((req,res,next)=>{
    const error= new Error('Not Found');
    error.status(404)
})
app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        message:error.message
    })
})
  
module.exports=app;
