const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
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

// 使用者可以新增一家餐廳 
// create 取得表單 GET  http://localhost:3000/restaurants/new
// create 輸入表單 POST http://localhost:3000/restaurants

// 使用者可以瀏覽一家餐廳的詳細資訊
// Read 取得特定表單 GET  http://localhost:3000/restaurants/:id
// 使用者可以瀏覽全部所有餐廳
// Read 取得所有表單 GET  http://localhost:3000/restaurants

// 使用者可以修改一家餐廳的資訊
// Update 取得修改表單 GET  http://localhost:3000/restaurants/:id/edit
// Update 修改表單 POST http://localhost:3000/restaurants/:id

// 使用者可以刪除一家餐廳
// Delete 刪除一筆表單 POST http://localhost:3000/restaurants/:id/delete

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

// restaurants首頁
app.get('/', (req, res) => {
  res.render('index')
})

// restaurants搜尋頁面
app.get('/search', (req, res) => {
  const word = req.query.keyword
  const search = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(word.toLowerCase()) || restaurant.category.toLowerCase().includes(word.toLowerCase())
  })
  res.render('index', { list: search, keyword: word })
})

// Read 取得所有表單
app.get('/restaurants', (req, res) => {
  res.send('Read 取得所有表單')
})

// create 取得新增表單頁面
app.get('/restaurants/new', (req, res) => {
  res.send('create 取得新增表單頁面')
})

// Read 取得特定表單內容
app.get('/restaurants/:id', (req, res) => {
  res.send('Read 取得特定表單內容')
})

// create 新增一筆表單
app.post('/restaurants', (req, res) => {
  res.send('create 新增一筆表單')
})

// Update 取得修改表單頁面
app.get('/restaurants/:id/edit', (req, res) => {
  res.send('Update 取得修改表單頁面')
})

// Update 修改表單
app.post('/restaurants/:id/edit', (req, res) => {
  res.send('Update 修改表單')
})

// Delete 刪除一筆表單
app.post('/restaurants/:id/delete', (req, res) => {
  res.send('Delete 刪除一筆表單')
})

app.listen(port, () => {
  console.log(`The express is listening on http://localhost:${port}`)
})