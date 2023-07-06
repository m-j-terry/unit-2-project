const Book = require('../models/book')
const Checkout = require('../models/checkout')
const User = require('../models/user')

exports.indexBooks = async (req, res) => {
    try {
        const foundBooks = await Book.find({})
        res.json(foundBooks)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

exports.showBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id})
        const checkout = await Checkout.findOne({ bookRef: book })
        res.json({ title: book.title, author: book.author, available: checkout.available })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

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
        // const updates = Object.keys(req.body)
        // const book = await Book.findOne({ _id: req.params.id })
        // updates.forEach(update => book[update] = req.body[update])
        // await book.save()
        const book = await Book.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        res.json(book)
    } catch(error) {
        res.status(400).json({ message: error.message })
    }
}

exports.createBook = async (req, res) => {
    try {
        const book = await Book.create(req.body)
        const checkout = await Checkout.create({ bookRef: book })
        res.json(book)
    } catch(error) {
        res.status(400).json({message: error.message})
    }
}