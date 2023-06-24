const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')
const userController = require('../controllers/userController')

// INDEX


// NEW


// DESTROY 
router.delete('/:id', userController.auth, userController.deleteUser)

// UPDATE
router.put('/:id', userController.auth, userController.updateUser)

// CREATE
router.post('/', userController.createUser)

// EDIT


// SHOW


// unRESTful Routes
router.post('/login', userController.loginUser)

// CHECK OUT
router.put('/:id/books/:id/checkout', userController.auth, userController.checkOutBook)

// CHECK IN
router.put('/:id/books/:id/checkin', userController.auth, userController.checkInBook)

module.exports = router