const express = require('express');
const mongoose = require('mongoose')
const Order = require('../models/order.model')
const product = require('../models/product.model')
const router = express.Router();
const orderController=require('../controller/order.controller')
router.get('/',orderController.orders_get_all)
router.get('/addOrder/:productId', (req, res, next) => {
    res.render('addOrder', {
        id:req.params.productId,
        tittle: 'Add order'
    })
})
router.post('/',orderController.order_create_order)
router.get('/view/:orderId',orderController.orders_get)
router.delete('/delete/:orderId',orderController.orders_delete)
module.exports = router;