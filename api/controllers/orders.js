const Order = require("../models/order");
const mongoose = require("mongoose")
const Product = require("../models/product");
exports.orders_get_all = (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs =>{
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc=>{
                return{
                    _id: doc._id,
                    product:doc.product,
                    quantity:doc.quantity,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/orders/'+doc._id
                    }
                }
            })
            
        })
    })
    .catch(err =>{
        res.status(500).json({error:err})
    })
} 
exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product =>{
        if (!product){
            return res.status(404).json({
                message:"Product Not Found"
            })
        }
            const order = new Order({
                _id: mongoose 
                    .Types
                    .ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
        
        })
        
        .then(result =>{
            console.log(result);
                res.status(201).json({
                message: "Order Stored",
                createdOrder:{
                    _id :result._id,
                    product:result.product,
                    quantity:result.quantity
                },
                request:{
                    type: 'GET',
                    url:'http://localhost:3000/' + result._id
                }
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
    })
     
}
exports.order_get_order = (req,res, next)=>{
    
        Order.findById(req.params.orderId)
        .populate('product')
        .select('')
        .exec()
        .then(
            order=>{
                if(!order){
                    return res.status(404).json({
                        message:"Order Not Found"
                    })
                }
                res.status(200).json({
                    order: order,
                    request:{
                        type: 'GET',
                        url: 'http//localhost:3000/orders'
                    }
                })
            }
        ).catch(
            error=>{
                res.status(500).json({
                    error:err
                })
            }
        )
}
exports.order_delete_order = (req, res, next) => {
    Order.remove({_id: req.params.orderId})
    .exec()
    .then(result =>{
        res.status(200).json({
            message:"Order Deleted", 
            request:{
                type:"POST",
                url:'http//localhost:3000/order',
                body: {productId: 'ID', quantity:"Number"}
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err,
        })
    })
}