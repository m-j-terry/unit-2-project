const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')

// INDEX
router.get('/', bookController.indexBooks)

// NEW


// DESTROY or DISCARD 
router.delete('/:id', bookController.deleteBook)

// UPDATE
router.put('/:id', bookController.updateBook)

// CREATE
router.post('/', bookController.createBook)

// EDIT


// SHOW
router.get('/:id', bookController.showBook)


module.exports = router