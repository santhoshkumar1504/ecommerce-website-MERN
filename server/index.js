const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const path=require('path');
// Environment variable configuration
dotenv.config();

const dbConnect = require('./init/mongodb');
const {port}=require('./config/keys');
const { authRoute, userRoute, categoryRoute, orderRoute, productRoute, reviewRoute, productDetailRoute, checkoutRoute, likeRoute } = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

// Database Connection
dbConnect();

// app listening on Port
const app=express();

// middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

// for image
app.use('/images',express.static(path.join(__dirname,"uploads")));

// routes
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/users',userRoute);
app.use('/api/v1/categorys',categoryRoute);
app.use('/api/v1/orders',orderRoute);
app.use('/api/v1/products',productRoute);

//for products
app.use('/api/v1/reviews',reviewRoute);
app.use('/api/v1/product-detail',productDetailRoute);

// checkouts and liked products
app.use('/api/v1/checkouts',checkoutRoute);
app.use('/api/v1/liked',likeRoute);

app.listen(port,()=>{
    console.log("Server is running on "+port);
})

// error middleware
app.use(errorHandler);