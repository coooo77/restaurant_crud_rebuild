// routes/restaurant_routes.js
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

// 取得餐廳A到Z排列
router.get('/AtoZ', (req, res) => {
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
router.get('/ZtoA', (req, res) => {
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
router.get('/category', (req, res) => {
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
router.get('/location', (req, res) => {
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
router.get('/search', (req, res) => {
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

// 設定 /restaurants 路由
module.exports = router