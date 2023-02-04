const path = require('path')
const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const PORT = process.env.PORT || 5000

// when requires a function from another .js file, make sure to use {method1, method2}
// because module.exports = {errorHandler} in errorMiddleware.js
const {errorHandler} = require('./middleware/errorMiddleware')

// no need to use {connectDB}, because module.exports = connectDB in db.js
const connectDB = require('./config/db')

// connect to database
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

// app.get('/', (req, res) => {
//     // res.send('Hello')
//     res.json({message: 'Welcome'})

// })

//Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
    // Set build folder as static
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    // FIX: below code fixes app crashing on refresh in deployment
    app.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
    })
  } else {
    app.get('/', (_, res) => {
      res.status(200).json({ message: 'Welcome to the Support Desk API' })
    })
  }

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

