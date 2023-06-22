require('dotenv').config()
const app = require('./app')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000
const { MongoMemoryServer } = require('mongodb-memory-server')
let mongoServer 
(async () => {
    mongoServer = await MongoMemoryServer.create()
    // await mongoose.connect(mongoServer.getUri())
    console.log(mongoServer.getUri())
})()

mongoose.connection.once('open', () => console.log(`Mongo showing love`))
mongoose.connection.on('error', (e) => console.log(e))

app.listen(PORT, () => console.log(`We in the building ${PORT}`))