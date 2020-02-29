// routes/restaurant_routes.js
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

// restaurants首頁
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      // console.log(restaurants)
      return res.render('index', { restaurants })
    })
})

// 設定 /restaurants 路由
module.exports = router