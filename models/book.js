const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const bookSchema = new mongoose.Schema({
    title: String, 
    author: String,
    genre: String, 
    isbn: Number,
    condition: String,
    due: Date
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book