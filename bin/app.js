const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

mongoose
  .connect(
    'mongodb+srv://username:password@cluster<cluster-name>.mongodb.net/test?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('Connected to database!')
  })
  .catch(() => {
    console.log('Connection failed!')
  })

const AuthMiddleware = require('../middleware/AuthMiddleware')
const ErrorMiddleware = require('../middleware/ErrorMiddleware')

const auth = require('../routes/auth')
const posts = require('../routes/posts')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('../images', express.static(path.join('images')))

app.use(AuthMiddleware.unless({ path: /^\/auth./ }))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next()
});

app.use('/auth', auth)
app.use('/posts', posts)

app.use(ErrorMiddleware)

module.exports = app
