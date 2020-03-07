// routes/restaurant_routes.js
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

// restaurants首頁
router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

// 設定 /restaurants 路由
module.exports = router