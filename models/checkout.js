const mongoose = require('mongoose')

const checkoutSchema = new mongoose.Schema({
    bookRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', require: true },
    available: { type: Boolean, default: true },
    due: Date,
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: false }
})
            

const Checkout = mongoose.model('Checkout', checkoutSchema)

module.exports = Checkout