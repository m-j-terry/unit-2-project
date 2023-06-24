const Book = require('../models/book')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id })
        await book.deleteOne()
        res.json({ message: 'book deleted' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.updateBook = async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const book = await Book.findOne({ _id: req.params.id })
        updates.forEach(update => book[update] = req.body[update])
        await book.save()
        res.json(book)
    } catch(error) {
        res.status(400).json({ message: error.message })
    }
}

exports.createBook = async (req, res) => {
    try {
        const book = new Book(req.body)
        await book.save()        
        res.json(book)
    } catch(error) {
        res.status(400).json({message: error.message})
    }
}