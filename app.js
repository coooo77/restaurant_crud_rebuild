const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Restaurant = require('./models/restaurant')
// 引入js檢查新增資料是否有沒有輸入的情況
const listCheck = require('./checkNewList')
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
// Update 修改表單 PUT http://localhost:3000/restaurants/:id/edit_?method=PUT

// 使用者可以刪除一家餐廳
// Delete 刪除一筆表單 DELETE http://localhost:3000/restaurants/:id/delete_?method=DELETE

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// restaurants首頁
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      // console.log(restaurants)
      return res.render('index', { restaurants })
    })
})

// 取得餐廳A到Z排列
app.get('/AtoZ', (req, res) => {
  Restaurant.find()
    .sort('name')
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      // console.log(restaurants)
      return res.render('index', { restaurants })
    })
})

// 取得餐廳Z到A排列
app.get('/ZtoA', (req, res) => {
  Restaurant.find()
    .sort('-name')
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      // console.log(restaurants)
      return res.render('index', { restaurants })
    })
})

// 取得餐廳類別排列
app.get('/category', (req, res) => {
  Restaurant.find()
    .sort('category')
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      // console.log(restaurants)
      return res.render('index', { restaurants })
    })
})

// 取得餐廳地區排列
app.get('/location', (req, res) => {
  Restaurant.find()
    .sort('location')
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      // console.log(restaurants)
      return res.render('index', { restaurants })
    })
})

// restaurants搜尋頁面 兩個做法 1.先輸出整份清單，用JS比對 2.用mongodb指令去找
// 因時間不夠所以先試著用1.，之後回頭研究U82
app.get('/search', (req, res) => {
  const word = req.query.keyword
  Restaurant.find()
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      const search = restaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(word.toLowerCase()) || restaurant.category.toLowerCase().includes(word.toLowerCase())
      })
      res.render('index', { restaurants: search, keyword: word })
    })
})

// Read 取得所有表單
app.get('/restaurants', (req, res) => {
  // return res.redirect('/')
  res.redirect('/')
})

// create 取得新增表單頁面
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

// create 新增一筆表單 
// 資料庫動作比較慢，所以使用資料庫操作資料時，需要都在資料庫內處理，不然會有順序上的錯誤產生
// 先檢驗req的資料如果不齊全，就導向新增的頁面，並顯示有資料填寫不齊全
// 資料齊全，就存資料 導覽至主頁
// 針對資料輸入的優化，等時間夠再來修正 (例如Rating跟phone都是數字)
// 有排版上的問題，如果不是用card屬性增加edit、Detail、Delete，排版會崩壞
app.post('/restaurants', (req, res) => {

  if (listCheck(req.body)) {
    console.log('資料完整，可以開始存資料了')
    const newList = new Restaurant({
      name: req.body.name,
      name_en: req.body.name_en,
      category: req.body.category,
      image: req.body.image,
      location: req.body.location,
      phone: req.body.phone,
      google_map: req.body.google_map,
      rating: req.body.rating,
      description: req.body.description
    })
    newList.save(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  } else {
    console.log('網頁引導至/restaurants/new，提示資料不完整')
    const result = listCheck(req.body)
    return res.render('new', { result: !result })
  }
})

// Read 取得特定表單內容
app.get('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.error(err)
      return res.render('show', { list: restaurant })
    })
})

// Update 取得修改表單頁面
app.get('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.error(err)
      return res.render('edit', { list: restaurant })
    })
})

// Update 修改表單
app.put('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, data) => {
    if (err) return console.error(err)
    data.name = req.body.name
    data.name_en = req.body.name_en
    data.category = req.body.category
    data.image = req.body.image
    data.location = req.body.location
    data.phone = req.body.phone
    data.google_map = req.body.google_map
    data.rating = req.body.rating
    data.description = req.body.description
    data.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})


// Delete 刪除一筆表單
app.delete('/restaurants/:id/delete', (req, res) => {
  Restaurant.findById(req.params.id, (err, data) => {
    if (err) return console.error(err)
    data.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

app.listen(port, () => {
  console.log(`The express is listening on http://localhost:${port}`)
})