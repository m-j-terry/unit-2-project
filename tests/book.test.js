require('dotenv').config()
const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => console.log('let\'s get ready to test!'))
const User = require('../models/user')
const Book = require('../models/book')
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
        const user = new User({ name: 'John Doe', email: 'johndoe@email.com', password: 'john-pw' })
        await user.save()
        const token = await user.generateAuthToken()
        await book.save()
        const response = await request(app)
        .post(`/users/${user._id}/books`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'new', available: true, due: '07/29/2023' })

        expect(response.statusCode).toBe(200)
        expect(response.body.book.title).toEqual('An American Childhood')
        expect(response.body.book.author).toEqual('Annie Dillard')
        expect(response.body.book.genre).toEqual('Memoir')
        expect(response.body.book.isbn).toBe(9780060158057)
        expect(response.body.book.condition).toEqual('new')
        expect(response.body.book.available).toBe(true)
        expect(response.body.book.date).toBe('07/28/2023')
    })

    test('It should update a book', async () => {
        const user = new User({ name: 'John Doe', email: 'johndoe@email.com', password: 'john-pw' })
        await user.save()
        const token = await user.generateAuthToken()
        const book = new Book({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'new', available: true, due: '07/29/2023' })
        await book.save()
        const response = await request(app)
        .put(`/users/${user._id}/books/${book._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'used-good', available: false, due: null })

        expect(response.statusCode).toBe(200)
        expect(response.body.book.title).toEqual('An American Childhood')
        expect(response.body.book.author).toEqual('Annie Dillard')
        expect(response.body.book.genre).toEqual('Memoir')
        expect(response.body.book.isbn).toBe(9780060158057)
        expect(response.body.book.condition).toEqual('used-good')
        expect(response.body.book.available).toBe(false)
        expect(response.body.book.date).toBe(null)
    })

    test('It should delete a book', async () => {
        const user = new User({ name: 'John Doe', email: 'johndoe@email.com', password: 'john-pw' })
        await user.save()
        const token = await user.generateAuthToken()
        const book = new Book({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'poor', available: true, due: null })
        await book.save()
        const response = await request(app)
        .delete(`/users/${user._id}/books/${book._id}`)
        .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual('book deleted')
    })

    test('It should check out a book', async () => {
        const user = new User({ name: 'John Doe', email: 'johndoe@email.com', password: 'john-pw', books: [] })
        await user.save()
        const token = await user.generateAuthToken()
        const book = new Book({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'new', available: true, due: '07/29/2023' })
        await book.save()
        user.books.push(book)
        const response = await request(app)
        .put(`/users/${user._id}/books/${book._id}/checkout`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'new', available: true, due: setDate(Date.now) })

        expect(response.statusCode).toBe(200)
        expect(response.body.book.title).toEqual('An American Childhood')
        expect(response.body.book.author).toEqual('Annie Dillard')
        expect(response.body.book.genre).toEqual('Memoir')
        expect(response.body.book.isbn).toBe(9780060158057)
        expect(response.body.book.condition).toEqual('new')
        expect(response.body.book.available).toBe(true)
        expect(response.body.book.date).toBe(setDate(Date.now))
        expect(response.body.user.books).toBe([book])
    })

    test('It should check in a book', async () => {
        const user = new User({ name: 'John Doe', email: 'johndoe@email.com', password: 'john-pw', books: [] })
        await user.save()
        const token = await user.generateAuthToken()
        const book = new Book({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'new', available: false, due: '07/29/2023' })
        await book.save()
        user.books.push(book)
        await user.save()
        user.books.pop()
        await user.save()
        const response = await request(app)
        .put(`/users/${user._id}/books/${book._id}/checkout`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'new', available: true, due: null })

        expect(response.statusCode).toBe(200)
        expect(response.body.book.title).toEqual('An American Childhood')
        expect(response.body.book.author).toEqual('Annie Dillard')
        expect(response.body.book.genre).toEqual('Memoir')
        expect(response.body.book.isbn).toBe(9780060158057)
        expect(response.body.book.condition).toEqual('new')
        expect(response.body.book.available).toBe(true)
        expect(response.body.book.date).toBe(null)
        expect(response.body.user.books).toBe([])
    })
})

// USERS

describe('Test the users endpoints', () => {
    // test('It should create a new user', async () => {
    //     const response = await request(app)
    //     .post('/users')
    //     .send({ name: 'John Doe', email: 'john.doe@example.com', password: 'john-pw' })

    //     expect(response.statusCode).toBe(200)
    //     expect(response.body.user.name).toEqual('John Doe')
    //     expect(response.body.user.email).toEqual('john.doe@example.com')
    //     expect(response.body).toHaveProperty('token')
    // })

    // test('It should login a user', async () => {
    //     const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'john-pw' })
    //     await user.save()

    //     const response = await request(app)
    //     .post('/users/login')
    //     .send({ email: 'john.doe@example.com', password: 'john-pw' })

    //     expect(response.statusCode).toBe(200)
    //     expect(response.body.user.name).toEqual('John Doe')
    //     expect(response.body.user.email).toEqual('john.doe@example.com')
    //     expect(response.body).toHaveProperty('token')
    // })

    test('It should update a user', async () => {
        const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'john-pw' })
        await user.save()
        const token = await user.generateAuthToken()
        const response = await request(app)
        .put(`/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Jane Doe', email: 'jane.doe@example.com', password: 'jane-pw', books: [testBook] })
        
        expect(response.statusCode).toBe(200)
        expect(response.body.user.name).toEqual('Jane Doe')
        expect(response.body.user.email).toEqual('jane.doe@example.com')
    })

    // test('It should delete a user', async () => {
    //     const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'john-pw' })
    //     await user.save()
    //     const token = await user.generateAuthToken()

    //     const response = await request(app)
    //     .delete(`/users/${user._id}`)
    //     .set('Authorization', `Bearer ${token}`)
        
    //     expect(response.statusCode).toBe(200)
    //     expect(response.body.message).toEqual('User deleted')
    // })
})