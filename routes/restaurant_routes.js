// routes/restaurant_routes.js
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
// 引入js檢查新增資料是否有沒有輸入的情況
const listCheck = require('../checkNewList')

const { authenticated } = require('../config/auth')

// Read 取得所有表單 或 指定的排列
// Query String不只可以從input得到，用指定的網址也能讀取到 (課文U41)
// 有空閒回來試著將搜索、排序功能合併
router.get('/', authenticated, (req, res) => {
  const search_order = req.query.search_order
  Restaurant.find({ userId: req.user._id })
    .sort(search_order)
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      return res.render('index', { restaurants })
    })
})

// 取得搜索項目
router.get('/search', authenticated, (req, res) => {
  const word = req.query.keyword
  Restaurant.find({
    userId: req.user._id,
    $or: [
      { 'name': { "$regex": word.toString(), "$options": "i" } },
      { 'name_en': { "$regex": word.toString(), "$options": "i" } },
      { 'category': { "$regex": word.toString(), "$options": "i" } },
    ]
  }).lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      res.render('index', { restaurants, keyword: word })
    })
})

// create 取得新增表單頁面
router.get('/new', authenticated, (req, res) => {
  res.render('new')
})

// create 新增一筆表單 
// 資料庫動作比較慢，所以使用資料庫操作資料時，需要都在資料庫內處理，不然會有順序上的錯誤產生
// 先檢驗req的資料如果不齊全，就導向新增的頁面，並顯示有資料填寫不齊全
// 資料齊全，就存資料 導覽至主頁
// 針對資料輸入的優化，等時間夠再來修正 (例如Rating跟phone都是數字)
// 有排版上的問題，如果不是用card屬性增加edit、Detail、Delete，排版會崩壞
router.post('/', authenticated, (req, res) => {
  const data = req.body
  console.log(data)
  if (listCheck(req.body)) {
    console.log('資料完整，可以開始存資料了')
    const restaurant = new Restaurant({
      name: req.body.name,
      name_en: req.body.name_en,
      category: req.body.category,
      image: req.body.image,
      location: req.body.location,
      phone: req.body.phone,
      google_map: req.body.google_map,
      rating: req.body.rating,
      description: req.body.description,
      userId: req.user._id
    })
    restaurant.save(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  } else {
    console.log('網頁引導至/restaurants/new，提示資料不完整')
    const result = listCheck(req.body)
    return res.render('new', { result: !result, data })
  }
})

// Read 取得特定表單內容
router.get('/:id', authenticated, (req, res) => {
  Restaurant.findOne({ _id: req.params.id, userId: req.user._id })
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.error(err)
      return res.render('show', { list: restaurant })
    })
})

// Update 取得修改表單頁面
router.get('/:id/edit', authenticated, (req, res) => {
  Restaurant.findOne({ _id: req.params.id, userId: req.user._id })
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.error(err)
      return res.render('edit', { list: restaurant })
    })
})

// Update 修改表單
router.put('/:id/edit', authenticated, (req, res) => {
  Restaurant.findOne({ _id: req.params.id, userId: req.user._id }, (err, data) => {
    if (err) return console.error(err)
    Object.assign(data, req.body)
    data.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})

// Delete 刪除一筆表單
router.delete('/:id/delete', authenticated, (req, res) => {
  Restaurant.findOne({ _id: req.params.id, userId: req.user._id }, (err, data) => {
    if (err) return console.error(err)
    data.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

// 設定 /restaurants 路由
module.exports = router