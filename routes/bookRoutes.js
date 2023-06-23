const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')

// INDEX


// NEW


// DESTROY or DISCARD 
router.delete('/:id', bookController.deleteBook)

// UPDATE
router.put('/:id', bookController.updateBook)

// CREATE
router.post('/', bookController.createBook)

// EDIT


// SHOW


module.exports = router