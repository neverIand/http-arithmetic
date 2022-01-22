const express = require('express')
const MATH = require('../functions/math')
const router = express.Router()

// Extended: handling POST request
router.post('/', function (req, res, next) {
  // if (Object.keys(req.body).length === 0) {
  //   let error = new Error('Bad Request: Empty request body')
  //   error.httpStatusCode = 400
  //   throw error
  // }

  if (req.headers['content-type'] != 'application/json') {
    let error = new Error('Unsupported Media Type: Only json is allowed for POST request')
    error.httpStatusCode = 415
    throw error
  }

  // convert the body to an array so toLowercase() could be used
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
    map.set(bodyArr[i].name, bodyArr[i].value)
  }

  console.log(map)

  // check whether the necessary parameters exist
  if (map.has('arguments') && map.has('operation')) {
    let operation = map.get('operation').toLowerCase()
    let arguments = map.get('arguments')

    if (arguments.length < 2) {
      let error = new Error('Bad Request: Missing parameters, there should be 2 arguments')
      error.httpStatusCode = 400
      throw error
    }

    // find all the numerical values in arguments (POST)
    let validArgs = []
    for (let i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] === 'number') {
        validArgs.push(arguments[i])
      }
    }

    if (validArgs.length < 2) {
      let error = new Error('Bad Request: Missing parameters, there should be 2 valid arguments')
      error.httpStatusCode = 400
      throw error
    }

    let r = 0
    // Putting switch here means that the operation will be checked after checking arguments
    switch (
      operation // only the first two arguments will be involved in the operation
    ) {
      case 'add':
        r = MATH.add(validArgs[0], validArgs[1])
        break
      case 'subtract':
        r = MATH.subtract(validArgs[0], validArgs[1])
        break
      case 'multiply':
        r = MATH.multiply(validArgs[0], validArgs[1])
        break
      case 'divide':
        r = MATH.divide(validArgs[0], validArgs[1])
        break
      default:
        let error = new Error('Bad Request: Unsupported operation')
        error.httpStatusCode = 400
        // return next(error)
        throw error
    }
    res.json({ result: r })
  } else {
    let error = new Error('Bad Request: Missing necessary parameters')
    error.httpStatusCode = 400
    throw error
  }
})

module.exports = router