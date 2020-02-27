function listCheck(list) {
  let numOfCorrectData = 0

  for (key in list) {
    if (!list[key].trim()) {
      console.log(`${key}資料不完整！`)
    } else {
      console.log(`${key}資料完整！`)
      numOfCorrectData++
    }
  }

  if (numOfCorrectData !== Object.keys(list).length) {
    console.log('資料有缺失！')
    return false
  }

  console.log('所有資料完整！')
  return true
}
module.exports = listCheck