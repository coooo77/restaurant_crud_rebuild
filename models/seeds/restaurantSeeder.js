const mongoose = require('mongoose')
// 引入Restaurant建立實例，存到db中
const Restaurant = require('../restaurant')
// 引入JSON種子資料
const restaurantList = require('./restaurant')

mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error！')
})

db.once('open', () => {
  console.log('mongodb connected！')
  // console.log('restaurantList.result.length', restaurantList.results[0].google_map)
  for (let i = 0; i < restaurantList.results.length; i++) {
    Restaurant.create({
      id: restaurantList.results[i].id,
      name: restaurantList.results[i].name,
      name_en: restaurantList.results[i].name_en,
      category: restaurantList.results[i].category,
      image: restaurantList.results[i].image,
      location: restaurantList.results[i].location,
      phone: restaurantList.results[i].phone,
      google_map: restaurantList.results[i].google_map,
      rating: restaurantList.results[i].rating,
      description: restaurantList.results[i].description,
    })
  }
  console.log('done！')
})
