const express = require('express')
const app = express()
const port = 3000

let bodyParser = require('body-parser')
// if contentType is 'application/json'
app.use(bodyParser.json())

// if contentType is 'application/x-www-form-urlencoded'
// app.use(bodyParser.urlencoded({extended:false}))

app.all('*', function (req, res, next) {
  console.log(`received request from: ${req.headers.origin}`)
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Headers', 'content-type')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,GET,OPTIONS')
  res.header('X-Powered-By', '3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8')
  if (req.method.toLowerCase() === 'options') {
    // quickly returns options requests
    res.sendStatus(200)
  } else {
    next()
  }
})

// TODO: Error handling e.g. /divide/4 (partially done)
app.get('/add/:num1/:num2', function (req, res, next) {
  // console.log(req.headers)
  //let params = transformParams(req.params.num1, req.params.num2)
  //let result = add(params[0], params[1])
  let result = add(req.params.num1, req.params.num2)
  res.set('Content-Type', 'text/plain').send(result + '')
})

app.get('/subtract/:num1/:num2', function (req, res, next) {
  let result = subtract(req.params.num1, req.params.num2)
  res.set('Content-Type', 'text/plain').send(result + '')
})

app.get('/multiply/:num1/:num2', function (req, res, next) {
  let result = multiply(req.params.num1, req.params.num2)
  res.set('Content-Type', 'text/plain').send(result + '')
})

app.get('/divide/:num1/:num2', function (req, res, next) {
  let result = divide(req.params.num1, req.params.num2)
  res.set('Content-Type', 'text/plain').send(result + '')
})

// Extended: handling POST request
app.post('/', function (req, res, next) {
  let r = 0

  switch (req.body.operation) {
    case 'add':
      r = add(req.body.arguments[0], req.body.arguments[1])
      break
    case 'subtract':
      r = subtract(req.body.arguments[0], req.body.arguments[1])
      break
    case 'multiply':
      r = multiply(req.body.arguments[0], req.body.arguments[1])
      break
    case 'divide':
      r = divide(req.body.arguments[0], req.body.arguments[1])
      break
  }

  res.json({ result: r })
})

// if matches none of the above
app.all('*', (req, res) => {
  let error = new Error('Content not exist')
  error.httpStatusCode = 404
  // return next(error)
  throw error
})

// global error handler
app.use((err, req, res, next) => {
  //console.error(err.stack)
  let output = {
    status: err.httpStatusCode,
    message: err.message,
  }
  res.status(err.httpStatusCode).json(output)
})

/* Check and transform parameters */
function transformParams(param1, param2) {
  console.log(`num1: ${param1}, num2: ${param2}`)
  if (!param1 || !param2) {
    // Check empty value, currently not working
    let error = new Error('Bad Request: Missing Parameters')
    error.httpStatusCode = 400
    // return next(error)
    throw error
  }
  let num1 = Number(param1)
  let num2 = Number(param2)
  // console.log(`Converted num1: ${num1}, num2: ${num2}`)
  if (isNaN(num1) || isNaN(num2)) {
    let error = new Error('Bad Request: Invalid Parameters')
    error.httpStatusCode = 400
    // return next(error)
    throw error
  }

  return [num1, num2]
}

/* Arithmetric functions */
function add(a, b) {
  return transformParams(a, b)[0] + transformParams(a, b)[1]
}

function subtract(a, b) {
  return a - b
}

function multiply(a, b) {
  return a * b
}

function divide(a, b) {
  if (transformParams(a, b)[1] === 0) {
    let error = new Error('Bad Request: Zero Division')
    error.httpStatusCode = 400
    //return next(error)
    throw error
  }
  return transformParams(a, b)[0] / transformParams(a, b)[1]
}

app.listen(port, () => console.log(`App listening on port ${port}!`))
