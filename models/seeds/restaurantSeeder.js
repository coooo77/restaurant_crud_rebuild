const mongoose = require('mongoose')
// 引入Restaurant、User建立實例，存到db中
const User = require('../user')
const Restaurant = require('../restaurant')
// 引入JSON種子資料
const UserList = require('./user')
const restaurantList = require('./restaurant')
// 載入 bcryptjs library
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error！')
})

db.once('open', () => {
  console.log('mongodb connected！')

  // 雖然已經先存入使用者了，但是找不到該使用者，WHY?
  // 推測可能是因為操作資料庫的緣故產生順序上的差異，所以要用.then或.exec等語法?
  // 看別人作法是分開輸入使用者跟餐廳清單才成功。

  // for (let i = 0; i < UserList.users.length; i++) {
  //   const newUser = new User(UserList.users[i])
  //   newUser.save()
  // } 

  // User.findOne({ name: "使用者01" }, (err, user) => {
  //   if (err) return console.error(err)
  //   console.log('user', user)
  //   for (let i = 0; i < 3; i++) {
  //     restaurantList.results[i].userId = user._id
  //     Restaurant.create(restaurantList.results[i])
  //   }
  // })
  // User.findOne({ name: "使用者02" }, (err, user) => {
  //   if (err) return console.error(err)
  //   for (let i = 3; i < 6; i++) {
  //     restaurantList.results[i].userId = user._i
  //     Restaurant.create(restaurantList.results[i])
  //   }
  // })

  // 參考別人的做法，先做一個空陣列貯存使用者資料
  // users.push(newUser)不能放在bcrypt程式碼內，可能也跟程式碼執行順序有關?
  const users = []
  for (let i = 0; i < UserList.users.length; i++) {
    const newUser = new User(UserList.users[i])
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err
        newUser.password = hash
        newUser.save()
      })
    })
    users.push(newUser)
  }

  // 給使用者01 #1~#3資料
  for (let i = 0; i < 3; i++) {
    restaurantList.results[i].userId = users[0]._id
    Restaurant.create(restaurantList.results[i])
  }
  // 給使用者02 #4~#6資料
  for (let i = 3; i < 6; i++) {
    restaurantList.results[i].userId = users[1]._id
    Restaurant.create(restaurantList.results[i])
  }

  console.log('done！')
})