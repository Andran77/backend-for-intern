const jwt = require('jsonwebtoken')
const unless = require('express-unless')

const config = require('../config')
const User = require('../models/user')

const AuthMiddleware = async (req, res, next) => {
  const token = req.get('Authorization')

  try {
    const data = await jwt.verify(token.substr(7), config.secret)
    const email = data.email

    User.findOne({ email })
      .then(user => {
        req.user = user
        next()
      })
      .catch(err => {
        return res.status(401).json({
          message: 'Auth failed'
        })
      })
  } catch(error) {
    return res.status(401).json({
      message: 'Auth failed!'
    });
  }
}

AuthMiddleware.unless = unless

module.exports = AuthMiddleware