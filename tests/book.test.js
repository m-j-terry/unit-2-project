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
        let user = new User({ name: 'John Doe', email: 'johndoe@email.com', password: 'john-pw', books: [] })
        await user.save()
        const token = await user.generateAuthToken()
        const book = await Book.create({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'new' })
        const checkout = await Checkout.create({ bookTitle: book, available: true })

        const response = await request(app)
        .put(`/users/${user._id}/books/${book._id}/checkout`)
        .set('Authorization', `Bearer ${token}`)
        .send()

        user = response.body.borrower

        console.log(response.body.borrower.books[0], user.books[0])

        expect(response.statusCode).toBe(200)
        expect(response.body.bookTitle.title).toEqual('An American Childhood')
        expect(response.body.bookTitle.author).toEqual('Annie Dillard')
        expect(response.body.bookTitle.genre).toEqual('Memoir')
        expect(response.body.bookTitle.isbn).toBe(9780060158057)
        expect(response.body.bookTitle.condition).toEqual('new')
        expect(response.body.borrower).toBe(user)
        expect(response.body.borrower.books[0]).toEqual(user.books[0])
        expect(response.body.available).toBe(false)
        expect(response.body.due)
    })

    test('It should check in a book', async () => {
        const user = new User({ name: 'John Doe', email: 'johndoe@email.com', password: 'john-pw', books: [] })
        await user.save()
        const token = await user.generateAuthToken()
        const book = await Book.create({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'new' })
        const checkout = await Checkout.create({ bookTitle: book, available: false })

        const response = await request(app)
        .put(`/users/${user._id}/books/${book._id}/checkin`)
        .set('Authorization', `Bearer ${token}`)
        .send()

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
            
        console.log(response)
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