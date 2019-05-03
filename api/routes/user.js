const express = require('express');
const mongoose = require('mongoose')
var jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user.model')
const bcrypt = require('bcrypt');
router.post('/singup', (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'already exits'
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    res.status(500).json({
                        error: err
                    })
                } else {
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                        .then(result => {
                            console.log(result)
                            res.status(201).json({
                                message: 'singup sucessfully'
                            })
                        })
                        .catch(error => {
                            res.status(500).json({
                                error: err
                            })
                        })
                }
            });
        }
    }).catch()

})
router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Authendication Fail'
            })
        } else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth fail'
                    })
                }
                if (result) {
                    var token = jwt.sign({
                        email: user[0].email,
                        password: user[0].password
                    },process.env.JWT_KEY,{
                        expiresIn:"1h"
                    })
                    return res.status(200).json({
                        message: 'Sucessfully login',
                        token:token
                    })
                }
                else {
                    res.status(401).json({
                        message: 'Auth fail'
                    })
                }
            });
        }
    })
})
router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec().
        then(result => {
            console.log(result)
            res.status(200).json({
                message: "user Deleted",
            });
        }).catch(err => {
            console.log(err)
            res.status(500).json({ error: err });

        })
})
module.exports = router;