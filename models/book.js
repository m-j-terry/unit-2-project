const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const bookSchema = new mongoose.Schema({
    title: String, 
    author: String,
    genre: String, 
    read: Boolean,
    isbn: Number
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book