const express = require('express')
const morgan = require('morgan')
const userRoutes = require('./routes/userRoutes')
const bookRoutes = require('./routes/bookRoutes')
const app = express() 

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('combined'))
app.use('/users', userRoutes)
app.use('/users/:id/books', bookRoutes)

module.exports = app