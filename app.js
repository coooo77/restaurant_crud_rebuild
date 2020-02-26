const express = require('express')
const app = express()
const port = 3000
const Restaurant = require('./models/restaurant')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error！')
})

db.once('open', () => {
  console.log('mongodb connected！')
})

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.listen(port, () => {
  console.log(`The express is listening on http://localhost:${port}`)
})