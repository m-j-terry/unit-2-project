const mongoose = require('mongoose')
let date = new Date()

const checkoutSchema = new mongoose.Schema({
    bookTitle: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', require: true },
    available: { type: Boolean, default: true },
    due: Date
})
            

const Checkout = mongoose.model('Checkout', checkoutSchema)

module.exports = Checkout