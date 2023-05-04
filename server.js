// require packages
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rowdy = require('rowdy-logger')

// config express app
const app = express()
const PORT = process.env.PORT || 8000
// for debug logging 
const rowdyResults = rowdy.begin(app)
// cross origin resource sharing 
app.use(cors())
// request body parsing
app.use(express.json())

// GET / -- test index route
app.get('/', (req, res) => {
    res.json({ msg: 'Welcome to npsExplorer' })
})

// controllers
app.use('/api-v1/users', require('./controllers/api-v1/users.js'))
app.use('/api-v1/experiences', require('./controllers/api-v1/experiences.js'))

// hey listen
app.listen(PORT, () => {
    rowdyResults.print()
    console.log(`is that port ${PORT} I hear? 🙉`)
})



