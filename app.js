const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const mongoose = require('mongoose')

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user')
mongoose.connect('mongodb+srv://admin:' + process.env.MONGO_ATLAS_PW +'@shop-restful-api-howto.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
// mongoose.Promise = global.Promise
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 'Origin, X-requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === "OPTIONS"){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//Route handling
app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/user', userRoutes)

app.use((req, res, next) => {
    const error= new Error('Not Found');
    error.status = 404;
});
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})
module.exports = app;