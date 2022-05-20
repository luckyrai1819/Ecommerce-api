const express=require('express')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv');
dotenv.config()
const url=process.env.MONGO_URL;
mongoose.connect(url)
.then(()=>console.log('db connection successfull'))
.catch((err)=>console.log(err))

app.use(express.json())

const authRoute=require('./routes/auth')
app.use('/api/v1/auth',authRoute)

const userRoute=require('./routes/user')
app.use('/api/v1/users',userRoute);

const productRoute=require('./routes/product')
app.use('/api/v1/products',productRoute)

const orderRoute=require('./routes/order')
app.use('/api/v1/orders',orderRoute)

app.listen(process.env.PORT,()=>{
    console.log(`server is running at port ${process.env.PORT}`);
})