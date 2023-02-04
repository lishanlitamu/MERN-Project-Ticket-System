const express = require('express')
const router = express.Router()

const {registerUser, loginUser, getMe} = require('../controllers/userController')

// http://localhost:5000/api/users
// router.post('/', (req, res) => {
//     res.send('Register Route')
// })

const {protect} = require('../middleware/authmiddleware')

// Register User
// Go to Postman, http://localhost:5000/api/users
// Click post => Select Body => Select urlencoded => typy in key-value pair for name, email, and password
// It will post this user info to Mongo Database - TicketDB
// It also returns a json formatted doc with name, email, password and token as defined in userController.js

// If copy and paste this user token into http://localhost:5000/api/users/me with Get request
// then => authorization => drop-down list select "Bearer Token" => paste token => show whatever returns from getMe in userController.js
router.post('/', registerUser)

// http://localhost:5000/api/users/testing
// router.get('/testing', (req, res) => {
//     res.json({id:'testingID'})
// } )

// http://localhost:5000/api/users/login
// router.post('/login', (req, res) => {
//     res.send('Login Route')
// })

router.post('/login', loginUser)
// create a protected route for getting more info about user, me
// router.get('/me', getMe) // Add and edit getMe in userController

// whenever you wanna protect a route just add method protect in the second variable of get method
router.get('/me', protect, getMe)

module.exports = router