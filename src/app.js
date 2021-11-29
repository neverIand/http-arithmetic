const express = require('express')
const app = express()
const port = 3000

// app.all('*', function (req, res, next) {
//   res.setHeader('Content-Type', 'text/plain')
//   next()
// })

// TODO: Error handling e.g. /divide/4
// TODO: implement subtract and multiply after everything works properly
app.get('/add/:num1/:num2', function (req, res, next) {
  let params = transformParams(req.params.num1, req.params.num2)
  let result = add(params[0], params[1])
  res.json(result)
})

app.get('/divide/:num1/:num2', function (req, res, next) {
  let params = transformParams(req.params.num1, req.params.num2)
  let result = divide(params[0], params[1])
  res.json(result)
})

// app.use('*', (err, req, res, next) => {
//   console.error(err.stack)
//   //res.status(404).send(err.message)
//   let output = {
//     error: 404,
//     message: 'Not exist',
//   }
//   res.status(o9utput.error).json(output)
// })

// global error handling
app.use((err, req, res, next) => {
  //console.error(err.stack)
  let output = {
    error: err.httpStatusCode,
    message: err.message
  }
  res.status(err.httpStatusCode).json(output)
})



/* 
TODO: RESTful
*/
/*
 *
 *
 */

/* Check and transform parameters */
function transformParams(param1, param2) {
  console.log(`num1: ${param1}, num2: ${param2}`)
  if (!param1 || !param2) {
    let error = new Error('Missing Parameters')
    error.httpStatusCode = 400
    return next(error)
  } else {
    let num1 = Number(param1)
    let num2 = Number(param2)
    // console.log(`Converted num1: ${num1}, num2: ${num2}`)
    if (isNaN(num1) || isNaN(num2)) {
      let error = new Error('Invalid Parameters')
      error.httpStatusCode = 400
      return next(error)
    }

    return [num1, num2]
  }
}

/* Arithmetric functions */
function add(a, b) {
  return a + b
}

function subtract(a, b) {
  return a - b
}

function multiply(a, b) {
  return a * b
}

function divide(a, b) {
  if (b === 0) {
    let error = new Error('Zero Division')
    error.httpStatusCode = 400
    //return next(error)
    throw error
  }
  return a / b
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
