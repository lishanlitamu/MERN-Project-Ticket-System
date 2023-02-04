const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
// module.exports = mongoose.model('User', userSchema), from userModel.js
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
// @desc Register a new user
// @route /api/users
// @access Public

// click poss on the route in Postman, it will post body data to server
const registerUser = asyncHandler(async (req, res) => {
    // console.log(req.body)

    const {name, email, password} = req.body

    // Validation, if any of these three attributes were empty when a post request was sent from postman
    // it will return an error status 400 witha key-value pair message
    if(!name || !email || !password){
        //return res.status(400).json({message: 'Please include all fields'})
        // or use a standard error handler
        res.status(400)
        throw new Error('Please include all fields!')
        // or use a custom error handler
    }

    // Find it user exists
    // User is the model with {name, email, password and more} schema
    // Find whether email is in User using User.findOne
    const userExists = await User.findOne({email})

    if(userExists) {
        // if user exists, set error status to 400
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash password
    // these functions return promises so use await
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
  })

    // if user is successfully created, set status to 201
    if (user) {
        // 201 Created
        res.status(201).json({
            _id: user._id,// must use _id in mongoDB
            name: user.name,
            email: user.email,
            // jsonwebtoken, npm i jsonwebtoken
            token: generateToken(user._id),
        })
    }else {
        res.status(400)
        throw new error('Invalid user data')
    }


    // res.send('Register Route') // for testing only
})

// @desc Login a user
// @route /api/users/login
// @access Public

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // user is the User object that matches the given email address
    const user = await User.findOne({ email })

    // user.password is the password that corresponds to the given email address
    // we compare password after confirming user exits by checking with User.findOne({email})

    // Check user and passwords match
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        // jsonwebtoken, npm i jsonwebtoken
        token: generateToken(user._id),
      })
    } else {
      res.status(401) // Unauthorized request
      throw new Error('Invalid credentials')
    }
  })


// @desc    Get current user
// @route   /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
    }
    res.status(200).json(user)

  })

// Generate token
// whenever an update occurs in env file
// npm run server (to restart server)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })
  }

module.exports = {
    registerUser,
    loginUser,
    getMe,
}
