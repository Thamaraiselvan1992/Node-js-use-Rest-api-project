const express = require('express');
const mongoose = require('mongoose')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth');
const Product = require('../models/product.model')
const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('error'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
router.get('/', (req, res, next) => {
    Product
        .find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {

            res.render('products', {
                list: docs,
          
                tittle: 'Products'
            });
        })

        .catch(err => {
            console.log(err);
            res.status(502).json({ error: err })
        })
})
router.get('/addProduct', (req, res, next) => {
    res.render('addProduct', {
        tittle: 'Add Product'
    })
})
router.post('/', upload.single('productImage'), (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then((docs, err) => {
        if (!err) {
            console.log(docs)
            res.redirect('/products')
        } if (err) {

            res.render('addProduct', {
                tittle: 'Error',
            })
        }
    })
        .catch(err => {
            console.log(err)
        })
}
)



router.get('/:productId',upload.single('productImage'), (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec().
    then(docs => {
        if (docs) {
            res.render('productDetails', {
                tittle: 'Product Details',
                list: docs
            })
        } else {
            res.status(500).json({
                message: "Product Noot found",
                error: err
            })
        }

    }).catch(err => {
        console.log(err)
        res.status(500).json({ error: err });

    })
})
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec().
        then(result => {
            console.log(result)
            res.status(200).json({
                message: "product Deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:8080/products/' + result._id,
                    body: { name: "String", price: "Number" }
                }
            });
        }).catch(err => {
            console.log(err)
            res.status(500).json({ error: err });

        })
})
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec().
        then(result => {
            console.log(result)
            res.status(200).json({
                message: "product update",

            });
        }).catch(err => {
            console.log(err)
            res.status(500).json({ error: err });

        })
})
module.exports = router;