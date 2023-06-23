const Book = require('../models/book')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.checkInBook = async (req, res) => { 
    const book = new Book.findOne({ _id: req.params.id })
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
    book.due = null
    book.available = true
    await book.save()
    res.json(book, user.books)
}

exports.checkOutBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id })
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_SECRET)
        const user = new User.findOne({ _id: data._id })
        if (!user) {
            throw new Error()
        } else if (book.available === false) {
            res.json({ message: `We're sorry, ${book.name} is unavailable. Please check in again after ${book.due}.`})
        } else {
            user.books.push(book)
            await user.save()
            book.due = setDate(Date.now)
            book.available = false
            await book.save()
            function setDate(Date) {
                let date = Date.split('/').map(x => x * 1)
                if (date[0] === 02 && date[1] > 14) {
                    let remainingDays = 28 - date[1]
                    date[1] = 14 - remainingDays
                    date[0] = 03
                } else if (date[0] === 04 || date[0] === 06 || date[0] === 09 || date[0] === 11 && date[1] > 16) {
                    let remainingDays = 30 - date[1]
                    date[1] = 14 - remainingDays
                    date[0]++
                } else if (date[0] === 01 || date[0] === 03 || date[0] === 05 || date[0] === 07 || date[0] === 08 || date[0] === 10 && date[1] > 17) {
                    let remainingDays = 31 - date[1]
                    date[1] = 14 - remainingDays
                    date[0]++
                } else if (date[0] === 12 && date[1] > 17) {
                    let remainingDays = 31 - date[1]
                    date[2]++
                    date[1] = 14 - remainingDays
                    date[0] = 01
                } else {
                    date[1] = date[1] + 14
                }

                if (date[0] < 10 && date[1] < 10) {
                    date[0] = '0' + date[0] * 1
                    date[1] = '0' + date[1] * 1  
                } else if (date[0] < 10) {
                    date[0] = '0' + date[0] * 1
                } else if (date[1] < 10) {
                    date[1] = '0' + date[1] * 1  
                }
                return date.toString().replaceAll(',', '/')
            }
        }
        res.json(book, user.books)
    } catch(error) {
        res.status(400).json({ message: error.message })
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