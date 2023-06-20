const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')

// INDEX


// NEW


// DESTROY 
router.delete('/:id', userController.auth, bookController.deleteBook)

// UPDATE
router.delete('/:id', userController.auth, bookController.updateBook)

// CREATE
router.post('/', userController.auth, bookController.createBook)

// EDIT


// SHOW



module.exports = router