const express = require('express')
const app = express()
const port = 3000

let bodyParser = require('body-parser')
const { response } = require('express')
// if contentType is 'application/json'
app.use(bodyParser.json())
// app.use('', express.static('./public'))

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
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(`${__dirname}/public/Testbed.html`)
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
  console.log(req.body)
  let operation = req.body.operation.toLowerCase()
  let arguments = req.body.arguments
  
  if (operation && arguments) {
    if (arguments.length>2) {
      let error = new Error('Bad Request: Only 2 arguments supported')
        error.httpStatusCode = 400
        throw error
    }
    let r = 0
    switch (operation) {
      case 'add':
        r = add(arguments[0], arguments[1])
        break
      case 'subtract':
        r = subtract(arguments[0], arguments[1])
        break
      case 'multiply':
        r = multiply(arguments[0], arguments[1])
        break
      case 'divide':
        r = divide(arguments[0], arguments[1])
        break
      default:
        let error = new Error('Bad Request: Unsupported operation')
        error.httpStatusCode = 400
        // return next(error)
        throw error
    }
    res.json({ result: r })
  } else {
    let error = new Error('Bad Request: Missing parameters')
    error.httpStatusCode = 400
    // return next(error)
    throw error
  }
})

// if matches none of the above
app.all('*', (req, res) => {
  let message = 'Content does not exist or invalid parameters. Check https://github.com/neverIand/http-arithmetic/blob/master/README.md for more information.'
  // let message = `Content does not exist or missing parameters. Please check ${req.headers.host+'/Testbed.html'} for more information`
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
  console.log(`num1: ${param1}, num2: ${param2}`)
  if (!param1 || !param2) {
    // Check empty value, currently not working
    let error = new Error(
      'Bad Request: Missing parameters, there should be 2 arguments'
    )
    error.httpStatusCode = 400
    // return next(error)
    throw error
  }
  let num1 = Number(param1)
  let num2 = Number(param2)
  // console.log(`Converted num1: ${num1}, num2: ${num2}`)
  if (isNaN(num1) || isNaN(num2)) {
    let error = new Error('Bad Request: Invalid arguments, arguments should be a numerical value')
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
  return transformParams(a, b)[0] - transformParams(a, b)[1]
}

function multiply(a, b) {
  return transformParams(a, b)[0] * transformParams(a, b)[1]
}

function divide(a, b) {
  if (transformParams(a, b)[1] === 0) {
    let error = new Error('Internal Server Error: Zero division')
    error.httpStatusCode = 500
    //return next(error)
    throw error
  }
  return transformParams(a, b)[0] / transformParams(a, b)[1]
}

app.listen(port, () => console.log(`App listening on port ${port}!`))


