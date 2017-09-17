const http = require('http')
const express = require('express')
const path = require('path')
//const favicon = require('serve-favicon')
const logger = require('morgan')
const bodyParser = require('body-parser')
const sender = require('./routes/sender')
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

const index = require('./routes/index')
app.use('/', index)

app.use((req, res, next)=>{
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next)=>{ // eslint-disable-line
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
})

const port = normalizePort(process.env.PORT) || 3000
app.set('port', port)

const server = http.createServer(app)
sender.init(server)
server.listen(port)
server.on('error', onError)

function normalizePort(val) {
  const port = parseInt(val, 10)
  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port
  switch (error.code) {
    case 'EACCES': {
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    }
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}