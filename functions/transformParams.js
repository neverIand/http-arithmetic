/* Check and transform parameters */
function transformParams(param1, param2) {
  console.log(`num1: ${(param1, typeof param1)}, num2: ${(param2, typeof param2)}`)

  // convert to number
  const num1 = Number(param1)
  const num2 = Number(param2)

  // type check for GET request
  if (isNaN(num1) || isNaN(num2)) {
    let error = new Error('Bad Request: Invalid arguments, arguments should be a numerical value')
    error.httpStatusCode = 400
    throw error
  }

  console.log(`Converted num1: ${num1}, num2: ${num2}`)

  return [num1, num2]
}
module.exports={transformParams}