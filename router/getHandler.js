const express = require('express')
const MATH = require('../functions/math')
const router = express.Router()

router.get('/add/:num1/:num2', function (req, res, next) {
  let result = MATH.add(req.params.num1, req.params.num2)
  //console.log(res.getHeaders())
  res.set('Content-Type', 'text/plain').send(result + '')
})

router.get('/subtract/:num1/:num2', function (req, res, next) {
  let result = MATH.subtract(req.params.num1, req.params.num2)
  res.set('Content-Type', 'text/plain').send(result + '')
})

router.get('/multiply/:num1/:num2', function (req, res, next) {
  let result = MATH.multiply(req.params.num1, req.params.num2)
  res.set('Content-Type', 'text/plain').send(result + '')
})

router.get('/divide/:num1/:num2', function (req, res, next) {
  let result = MATH.divide(req.params.num1, req.params.num2)
  res.set('Content-Type', 'text/plain').send(result + '')
})

module.exports = router
