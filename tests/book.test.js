require('dotenv').config()
const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => console.log('let\'s get ready to test!'))
const User = require('../models/user')
const Book = require('../models/book')
const Checkout = require('../models/checkout')
let mongoServer

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
    await mongoose.connection.close()
    mongoServer.stop()
    server.close()
})

// BOOKS

describe('Test the books endpoints', () => {
    test('It should create a new book', async () => {
        const response = await request(app)
        .post('/books')
        .send({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'new' })

        console.log(response.body)

        // expect(response.statusCode).toBe(200)
        expect(response.body.title).toEqual('An American Childhood')
        expect(response.body.author).toEqual('Annie Dillard')
        expect(response.body.genre).toEqual('Memoir')
        expect(response.body.isbn).toBe(9780060158057)
        expect(response.body.condition).toEqual('new')
    })

    test('It should update a book', async () => {
        const book = new Book({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'new' })
        await book.save()
        const response = await request(app)
        .put(`/books/${book._id}`)
        .send({ condition: 'used-good' })

        expect(response.statusCode).toBe(200)
        expect(response.body.condition).toEqual('used-good')
    })

    test('It should delete a book', async () => {
        const book = new Book({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'poor' })
        await book.save()
        const response = await request(app)
        .delete(`/books/${book._id}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual('book deleted')
    })

    test('It should check out a book', async () => {
        const user = new User({ name: 'John Doe', email: 'johndoe@email.com', password: 'john-pw', books: [] })
        await user.save()
        const token = await user.generateAuthToken()
        const book = new Book({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'new' })
        await book.save()
        const checkout = new Checkout({ bookTitle: book })
        await checkout.save()
        user.books.push(book._id)
        await user.save()
        const response = await request(app)
        .put(`/users/${user._id}/books/${book._id}/checkout`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        //
        let timeStamp = new Date().getTime()
        let date = new Date(timeStamp)
        let dueDate = date.toLocaleDateString('en-US')
        function setDate(Date) {

            let date = Date.split('/').map(x => x * 1)
            if (date[0] === 2 && date[1] > 14) {
                let remainingDays = 28 - date[1]
                date[1] = 14 - remainingDays
                date[0] = 3
            } else if (date[0] === 4 || date[0] === 6 || date[0] === 9 || date[0] === 11 && date[1] > 16) {
                let remainingDays = 30 - date[1]
                date[1] = 14 - remainingDays
                date[0]++
            } else if (date[0] === 1 || date[0] === 3 || date[0] === 5 || date[0] === 7 || date[0] === 8 || date[0] === 10 && date[1] > 17) {
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
            return `${date.toString().replaceAll(',', '/')}`
        }
        //
        expect(response.statusCode).toBe(200)
        expect(response.body.bookTitle.title).toEqual('An American Childhood')
        expect(response.body.bookTitle.author).toEqual('Annie Dillard')
        expect(response.body.bookTitle.genre).toEqual('Memoir')
        expect(response.body.bookTitle.isbn).toBe(9780060158057)
        expect(response.body.bookTitle.condition).toEqual('new')
        expect(user.books[0]).toBe(book._id)
        expect(response.body.available).toBe(false)
        expect(response.body.due)
    })

    test('It should check in a book', async () => {
        const user = new User({ name: 'John Doe', email: 'johndoe@email.com', password: 'john-pw', books: [] })
        await user.save()
        const token = await user.generateAuthToken()
        const book = new Book({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'new' })
        await book.save()
        const checkout = new Checkout({ bookTitle: book, available: false })
        await checkout.save()
        user.books.push(book)
        await user.save()
        let checkin = user.books.indexOf(book)
        user.books.splice(checkin, 1)
        await user.save()
        const response = await request(app)
        .put(`/users/${user._id}/books/${book._id}/checkin`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'new' })

        expect(response.statusCode).toBe(200)
        expect(response.body.bookTitle.title).toEqual('An American Childhood')
        expect(response.body.bookTitle.author).toEqual('Annie Dillard')
        expect(response.body.bookTitle.genre).toEqual('Memoir')
        expect(response.body.bookTitle.isbn).toBe(9780060158057)
        expect(response.body.bookTitle.condition).toEqual('new')
        expect(user.books).toEqual([])
        expect(response.body.available).toBe(true)
    })
})

// USERS
describe('Test the users endpoints', () => {
    test('It should create a new user', async () => {
        const response = await request(app)
        .post('/users')
        .send({ name: 'John Doe', email: 'john.doe@example.com', password: 'john-pw' })

        expect(response.statusCode).toBe(200)
        expect(response.body.user.name).toEqual('John Doe')
        expect(response.body.user.email).toEqual('john.doe@example.com')
        expect(response.body).toHaveProperty('token')
    })

    test('It should login a user', async () => {
        const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'john-pw' })
        await user.save()

        const response = await request(app)
        .post('/users/login')
        .send({ email: 'john.doe@example.com', password: 'john-pw' })

        expect(response.statusCode).toBe(200)
        expect(response.body.user.name).toEqual('John Doe')
        expect(response.body.user.email).toEqual('john.doe@example.com')
        expect(response.body).toHaveProperty('token')
    })

    test('It should update a user', async () => {
        const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'john-pw' })
        await user.save()
        const token = await user.generateAuthToken()

        const response = await request(app)
            .put(`/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Jane Doe', email: 'jane.doe@example.com', password: 'jane-pw' })
        
        expect(response.statusCode).toBe(200)
        expect(response.body.name).toEqual('Jane Doe')
        expect(response.body.email).toEqual('jane.doe@example.com')
    })

    test('It should delete a user', async () => {
        const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'john-pw' })
        await user.save()
        const token = await user.generateAuthToken()

        const response = await request(app)
        .delete(`/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual('User deleted')
    })
})