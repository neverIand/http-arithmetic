const express = require('express')
const app = express()
const port = 3000

// TODO: add, subtract, multiply, divide
// TODO: Error code
app.get('/add/:num1/:num2', (req, res) => {
  let result = 0
  const num1 = Number(req.params.num1)
  const num2 = Number(req.params.num2)
  if (num1 == NaN || num2 == NaN) {
    res.send('Invalid parameters')
  }
  console.log(`num1: ${num1}, num2: ${num2}`)
  if (num1 && num2) {
    result = num1 + num2
    res.json(result)
  } else {
    res.send('Invalid parameters')
  }
})

// TODO: RESTful

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
