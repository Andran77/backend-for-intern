const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('../config')
const User = require('../models/user')

const router = express.Router()

router.post('/sign-up', (req,res) => {
    let { firstName, lastName, email, password, gender, birthDate } = req.body

    email = email.toLowerCase()
    password = bcrypt.hashSync(String(password), 8)

    const user = new User({
        firstName,
        lastName,
        email,
        password,
        gender,
        birthDate
    })
    user.save()
        .then(result => {
            res.status(201).json({
            message: 'User created!',
            result: result
            })
        })
        .catch(err => {
            res.status(500).json({
            error: err
            })
        })
})

router.post('/sign-in', (req,res) => {
    
    let { email, password } = req.body,
        fetchedUser

    email = email.toLowerCase()

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            fetchedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                config.secret,
                { expiresIn: '1h' }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Auth failed'
            });
        });
})

module.exports = router