const express = require('express')
const app = express()
const port = 3000

let bodyParser = require('body-parser')
const { response } = require('express')
// if contentType is 'application/json'
app.use(bodyParser.json())

// if contentType is 'application/x-www-form-urlencoded'
// app.use(bodyParser.urlencoded({extended:false}))

app.all('*', function (req, res, next) {
  // console.log(`received request from: ${req.headers.origin}`)
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Headers', 'content-type')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,GET,OPTIONS')
  res.header('X-Powered-By', '3.2.1')
  //res.header('Content-Type', 'application/json;charset=utf-8')
  if (req.method.toLowerCase() === 'options') {
    // quickly returns options requests
    res.sendStatus(200)
  } else {
    next()
  }
})

app.get('/', function (req, res, next) {
  res.setHeader('Content-Type', 'text/html')
  res.sendFile(`${__dirname}/public/Index.html`)
})

app.get('/add/:num1/:num2', function (req, res, next) {
  let result = add(req.params.num1, req.params.num2)
  //console.log(res.getHeaders())
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
  // if (Object.keys(req.body).length === 0) {
  //   let error = new Error('Bad Request: Empty request body')
  //   error.httpStatusCode = 400
  //   throw error
  // }

  if (req.headers['content-type'] != 'application/json') {
    let error = new Error(
      'Unsupported Media Type: Only json is allowed for POST request'
    )
    error.httpStatusCode = 415
    throw error
  }

  // convert the body to an array so that we can toLowercase()could be used
  let bodyArr = []
  for (let key in req.body) {
    if (typeof key === 'string') {
      bodyArr.push({
        name: key.toLowerCase(),
        value: req.body[key],
      })
    } else {
      bodyArr.push({
        name: key,
        value: req.body[key],
      })
    }
  }

  // An array of objects
  // console.log(`bodyArrStringfy: ${JSON.stringify(bodyArr)}`)

  // convert the array to a map to remove duplicate attributes
  // note that if there's duplicate, the latter elements will overwrite the previous ones
  let map = new Map()
  for (let i = 0; i < bodyArr.length; i++) {
    map.set(bodyArr[i].name,bodyArr[i].value)
  }

  console.log(map);

  // check whether the necessary parameters exist
  if (map.has('arguments') && map.has('operation')) {
    
    let operation=map.get('operation').toLowerCase()
    let arguments = map.get('arguments')
    
    if (arguments.length<2) {
    let error = new Error(
      'Bad Request: Missing parameters, there should be 2 arguments'
    )
    error.httpStatusCode = 400
    throw error
    }

    // find all the numerical values in arguments (POST)
    let validArgs = []
    for (let i = 0; i < arguments.length; i++) {
      if (typeof arguments[i]==='number') {
        validArgs.push(arguments[i])
      }
    }
 
    let r = 0
    switch (operation) {// only the first two arguments will be involved in the operation
    case 'add':
      r = add(validArgs[0], validArgs[1])
      break
    case 'subtract':
      r = subtract(validArgs[0], validArgs[1])
      break
    case 'multiply':
      r = multiply(validArgs[0], validArgs[1])
      break
    case 'divide':
      r = divide(validArgs[0], validArgs[1])
      break
    default:
      let error = new Error('Bad Request: Unsupported operation')
      error.httpStatusCode = 400
      // return next(error)
      throw error
  }
  res.json({ result: r })
  } else {
    let error = new Error(
      'Bad Request: Missing necessary parameters'
    )
    error.httpStatusCode = 400
    throw error
  }
})

// if matches none of the above
app.all('*', (req, res) => {
  let message =
    'Content does not exist or invalid parameters. Check https://github.com/neverIand/http-arithmetic/blob/master/README.md for more information.'

  let error = new Error(message)
  error.httpStatusCode = 404
  // return next(error)
  throw error
})

// global error handler, handles any error thrown previously
app.use((err, req, res, next) => {
  //console.error(err.stack)
  console.log(`${err.message}`)
  let output = {
    status: err.httpStatusCode,
    message: err.message,
  }
  res.status(err.httpStatusCode).json(output)
})

/* Check and transform parameters */
function transformParams(param1, param2) {
  console.log(`num1: ${param1, typeof param1}, num2: ${param2, typeof param2}`)

  // convert to number
  const num1 = Number(param1)
  const num2 = Number(param2)
  
  // type check for GET request
  if (isNaN(num1) || isNaN(num2)) {
    let error = new Error(
      'Bad Request: Invalid arguments, arguments should be a numerical value'
    )
    error.httpStatusCode = 400
    throw error
  }

  console.log(`Converted num1: ${num1}, num2: ${num2}`)

  return [num1, num2]
}

/* Arithmetric functions */
function add(a, b) {
  const params=transformParams(a, b)
  return params[0] + params[1]
}

function subtract(a, b) {
  const params=transformParams(a, b)
  return params[0] - params[1]
}

function multiply(a, b) {
  const params=transformParams(a, b)
  return params[0] * params[1]
}

function divide(a, b) {
  const params=transformParams(a, b)
  if (params[1] === 0) {
    let error = new Error('Internal Server Error: Zero division')
    error.httpStatusCode = 500
    //return next(error)
    throw error
  }
  return params[0] / params[1]
}

app.listen(port, () => console.log(`App listening on port ${port}!`))
