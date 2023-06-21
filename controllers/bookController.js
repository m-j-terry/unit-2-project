const Book = require('../models/book')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.deleteBook = async (req, res) => {
    try {
        //setting the 'book' to delete
        const book = await Book.findOne({ _id: req.params.id })
        //setting the user to .splice() the deleted book
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: data._id })
        if (!user) {
            throw new Error() 
        }
        req.user = user
        //removing 'book' from user.books array
        const bookIndex = user.books.indexOf(book)
        user.books.splice(bookIndex, 1)
        await user.save()
        res.json({ message: 'book deleted' })
        //removing 'book' from the database as its own instance
        await book.deleteOne()
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
        //declare 'user' in order to push 'book' into the user.books array
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: data._id })
        if (!user) {
            throw new Error()
        }
        req.user = user
        user.books.push(book)
        await user.save()
        res.json(book, user.books)
    } catch(error) {
        res.status(400).json({message: error.message})
    }
}