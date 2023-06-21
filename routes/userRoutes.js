const express = require('express')
const router = express.Router()
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

module.exports = router