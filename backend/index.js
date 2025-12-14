const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
// Environment variable configuration
dotenv.config();

const dbConnect = require('./init/mongodb');
const {port}=require('./config/keys');
const { authRoute, userRoute, categoryRoute, orderRoute, productRoute, reviewRoute } = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

// Database Connection
dbConnect();

// app listening on Port
const app=express();

// middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

// routes
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/users',userRoute);
app.use('/api/v1/categorys',categoryRoute);
app.use('/api/v1/orders',orderRoute);
app.use('/api/v1/products',productRoute);
app.use('/api/v1/reviews',reviewRoute);

// checkouts

app.listen(port,()=>{
    console.log("Server is running on "+port);
})

// error middleware
app.use(errorHandler);