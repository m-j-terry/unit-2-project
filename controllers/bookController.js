const Book = require('../models/book')
const Checkout = require('../models/checkout')

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
        // const foundBooks = await Book.find({})
        console.log(`This is book ${book}`)
        // console.log(foundBooks)
        // const findBook = foundBooks.indexOf(book)
        // const findBook = foundBooks.findIndex(item => item.isbn === book.isbn)
        // const foundBook = foundBooks[findBook]
        const checkout = await Checkout.findOne({ bookRef: book })
        console.log(checkout)
        res.json({ title: book.title, author: book.author, available: checkout.available})
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