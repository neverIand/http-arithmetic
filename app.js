const express = require('express')
// const https = require("https")
const fs = require('fs')
const app = express()
const getHandler = require('./router/getHandler')
const postHandler = require('./router/postHandler')
const port = 3000
// const port = 443

// configure https
const httpsOption = {
  key: fs.readFileSync('./https/privkey.pem'),
  cert: fs.readFileSync('./https/fullchain.pem'),
}

let bodyParser = require('body-parser')

// if contentType is 'application/json'
app.use(bodyParser.json())

// if contentType is 'application/x-www-form-urlencoded'
// app.use(bodyParser.urlencoded({extended:false}))

// register router
app.use(getHandler)
app.use(postHandler)

// expose the static resources
app.use(express.static('./public'))

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

app.listen(port, () => console.log(`App running at port ${port}!`))
// https.createServer(httpsOption, app).listen(port)
