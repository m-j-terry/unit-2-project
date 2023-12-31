const User = require('../models/user')
const Book = require('../models/book')
const Checkout = require('../models/checkout')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: data._id })
        if (!user) {
            throw new Error()
        }
        req.user = user
        next()
    } catch(error) {
        res.status(401).send('Not authorized')
    }
}

exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.json({ user, token })
    } catch(error) {
        res.status(400).json({message: error.message})
    }
}

exports.showUser = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id})
        res.json(user)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }) 
        const password = await bcrypt.compare(req.body.password, user.password)
        if (!user || !password) {
            res.status(400).send('Invalid login credentials')
        } else {
            const token = await user.generateAuthToken()
            res.json({ user, token })
        }
    } catch(error) {
        console.log(error.message)
        res.status(400).json({ message: error.message })
    }
}

exports.updateUser = async (req, res) => {
    try {
        // const updates = Object.keys(req.body)
        // const user = await User.findOne({ _id: req.params.id })
        // updates.forEach(update => user[update] = req.body[update])
        // await user.save()
        const user = await User.findOneAndUpdate({ _id: req.params.id}, req.body, { new: true })
        res.json(user)
    } catch(error) {
        res.status(400).json({message: error.message})
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await req.user.deleteOne()
        res.json({ message: 'User deleted' })
    } catch(error) {
        res.status(400).json({message: error.message})
    }
}

exports.checkInBook = async (req, res) => { 
    try {
        const book = await Book.findOne({ _id: req.params.id })
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: Object.values(data)[0] })
        const checkout = await Checkout.findOne({ bookRef: book })
        if (!user) {
            throw new Error() 
        } else if (checkout.available === true) {
            res.json({ message: `Action prohibited because ${book.title} is not checked out in your name. Your account has the following books checked out: ${indexBooks()} If you would like to check out ${book.title}, please follow the /checkout route.`})
        } else {
            req.user = user
            //removing 'book' from user.books array
            const bookIndex = user.books.indexOf(book)
            user.books.splice(bookIndex, 1)
            await user.save()
            await checkout.deleteOne()
            const checkout1 = await Checkout.create({ bookRef: book })
            res.json(checkout1)
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.indexBorrowedBooks = async (req, res) => {
    try { 
        const user = await User.findOne({ _id: req.params.id })
        res.json({ borrowedBooks: user.books })
    } catch(error) {
        res.status(400).send({ message: error.message })
    }
}

exports.checkOutBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id })
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: Object.values(data)[0] })
        const checkout = await Checkout.findOne({ bookRef: req.params.id })
        if (!user) {
            console.log('user error')
            throw new Error()
        } else if (checkout.available === false) {
            console.log('checkout.available error')
            res.json({ message: `We're sorry, ${book.name} is unavailable. Please check in again after ${book.due}.`})
        } else {
            // dueDate variables
            let timeStamp = new Date().getTime()
            let date = new Date(timeStamp)
            let dueDate = date.toLocaleDateString('en-US')
            user.books.push(book) //can allow for duplicate pushes. 
            user.save()
            await checkout.deleteOne()
            const checkout1 = await Checkout.create({ available: false, due: setDate(dueDate), bookRef: book, borrower: user })
            res.json(checkout1)
        }
    } catch(error) {
        res.status(400).json({ message: error.message })
    }
}

function setDate(Date) {

    let date = Date.split('/').map(x => x * 1)
    if (date[0] === 2 && date[1] > 14) {
        let remainingDays = 28 - date[1]
        date[1] = 14 - remainingDays
        date[0] = 3
    } else if (date[0] === 4 && date[1] > 16 || date[0] === 6 && date[1] > 16 || date[0] === 9 && date[1] > 16 || date[0] === 11 && date[1] > 16) {
        let remainingDays = 30 - date[1]
        date[1] = 14 - remainingDays
        date[0]++
    } else if (date[0] === 1 && date[1] > 17 || date[0] === 3 && date[1] > 17 || date[0] === 5 && date[1] > 17 || date[0] === 7 && date[1] > 17 || date[0] === 8 && date[1] > 17 || date[0] === 10 && date[1] > 17) {
        let remainingDays = 31 - date[1]
        date[1] = 14 - remainingDays
        date[0]++
    } else if (date[0] === 12 && date[1] > 17) {
        let remainingDays = 31 - date[1]
        date[2]++
        date[1] = 14 - remainingDays
        date[0] = 1
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

function indexBooks() {
    if (User.books === undefined) {
        return "Oops! Your account is empty!"
    } else {
        return `${User.books}.`
    }
}