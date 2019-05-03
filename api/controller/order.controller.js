const mongoose = require('mongoose')
const Order = require('../models/order.model');
const product = require('../models/product.model');
exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name price productImage')
        .exec()

        .then(docs => {
            res.status(200).render('order', {
                list: docs,
                tittle: 'Orders'
            })
        })
}
exports.order_create_order = (req, res, next) => {
    product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(502).json({
                
                    message: "The product not found"+product
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            })
            return order.save().then(result => {
                console.log(result)
                res.status(200).json({
                    message: "Order Stored",
                    createOrder: {
                        _id: result._id,
                        product: result.product,
                        quantity: result.quantity
                    },
                    request: {
                        request: {
                            type: "GET",
                            url: "http://localhost:8080/order/" + result._id
                        }
                    }
                })

            })

        })
        .catch(err => {
            console.log(err)
            res.status(501).json({ message: "Product Not Found", error: err });
        })

}
exports.orders_get = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(docs => {
            res.status(200).render('orderView', {
                order: docs,
                tittle: 'Order View'
            })
        })
        .catch(err => {
            res.status(200).json({ err: error })
        })
}
exports.orders_delete = (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({ _id: id })
        .exec()
        .then((docs, err) => {
            if (!err) {
                res.status(502).send('No error');
            }
            else {
                res.status(501).send('Error');
            }
        })
        .catch(err => {
            console.log(err)
            res.status(504).json({ error: err });

        })
}