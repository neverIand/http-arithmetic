const format = require('./transformParams')

function add(a, b) {
  const params = format.transformParams(a, b)
  return params[0] + params[1]
}

function subtract(a, b) {
  const params = format.transformParams(a, b)
  return params[0] - params[1]
}
function multiply(a, b) {
  const params = format.transformParams(a, b)
  return params[0] * params[1]
}

function divide(a, b) {
  const params = format.transformParams(a, b)
  if (params[1] === 0) {
    let error = new Error('Internal Server Error: Zero division')
    error.httpStatusCode = 500
    //return next(error)
    throw error
  }
  return params[0] / params[1]
}

module.exports = { add, subtract, multiply, divide }
