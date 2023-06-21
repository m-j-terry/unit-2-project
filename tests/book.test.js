require('dotenv').config()
const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const server = app.listen(3000, () => console.log('let\'s get ready to test!'))
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

describe('Test the books endpoints', () => {
    test('It should create a new book', async () => {
        const user = new User({ name: 'John Doe', email: 'johndoe@email.com', password: 'john-pw' })
        await user.save()
        const token = await user.generateAuthToken()

        const response = await request(app)
        .post(`/users/${user._id}/books`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'new', date: 07/29/2023})

        expect(response.statusCode).toBe(200)
        expect(response.body.book.title).toEqual('An American Childhood')
        expect(response.body.book.author).toEqual('Annie Dillard')
        expect(response.body.book.genre).toEqual('Memoir')
        expect(response.body.book.isbn).toBe(9780060158057)
        expect(response.body.book.condition).toEqual('new')
        expect(response.body.book.date).toBe(07/29/2023)
    })

    test('It should update a book', async () => {
        const user = new User({ name: 'John Doe', email: 'johndoe@email.com', password: 'john-pw' })
        await user.save()
        const token = await user.generateAuthToken()
        const book = new Book({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'new', due: 07/29/2023 })
        
        const response = await request(app)
        .put(`/users/${user._id}/books/${book._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'used-good', due: null })

        expect(response.statusCode).toBe(200)
        expect(response.body.book.title).toEqual('An American Childhood')
        expect(response.body.book.author).toEqual('Annie Dillard')
        expect(response.body.book.genre).toEqual('Memoir')
        expect(response.body.book.isbn).toBe(9780060158057)
        expect(response.body.book.condition).toEqual('used-good')
        expect(response.body.book.date).toBe(null)
    })

    test('It should delete a book', async () => {
        const user = new User({ name: 'John Doe', email: 'johndoe@email.com', password: 'john-pw' })
        await user.save()
        const token = await user.generateAuthToken()
        const book = new Book({ title: 'An American Childhood', author: 'Annie Dillard', genre: 'Memoir', isbn: 9780060158057, condition: 'poor', due: null })
    
        const response = await request(app)
        .delete(`/users/${user._id}/books/${book._id}`)
        .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual('book deleted')
    })
})