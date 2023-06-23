const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')
const userController = require('../controllers/userController')

// INDEX


// NEW


// DESTROY or DISCARD 
router.delete('/:id', userController.auth, bookController.deleteBook)

// UPDATE
router.put('/:id', userController.auth, bookController.updateBook)

// CREATE
router.post('/', userController.auth, bookController.createBook)

// EDIT


// SHOW



// unRESTful routes //

// CHECK OUT
router.put('/:id/checkout', userController.auth, bookController.checkOutBook)

// CHECK IN
router.put('/:id/checkin', userController.auth, bookController.checkInBook)

module.exports = router