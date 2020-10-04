const express = require('express')
const http = require('http')
const os = require('os')
const app = express()
const {
  PORT,
  LOG_RESPONSE_BODY = true,
  LOG_CONNECTION_INTERVAL = 0,
  RESONSE_LATENCY = 0,
  CONNECTION_CLOSE = false,
  SERVER_KEEPALIVE_TIMEOUT = 5 * 1000
} = process.env

const server = http.createServer(app)
server.keepAliveTimeout = SERVER_KEEPALIVE_TIMEOUT

const getConnections = async () => {
  return (new Promise( (resolve, reject) => {
    server.getConnections((err, count) => {
      if(err){
        reject(err)
      }else{
        resolve(count)
      }
    })
  }))
}

let handledRequest = 0
app.all('/', async (req, res) => {
  const {path, headers, method, body, cookies, fresh, hostname,
    ip, ips, protocol, query, subdomains, xhr} = req
    const echo = {path, headers, method, body, cookies, fresh, hostname,
    ip, ips, protocol, query, subdomains, xhr}
    const more = {
        hostname: os.hostname(),
        connection: {
            servername: req.connection.servername,
            count: await getConnections()
        }
    }
    const responseBody = {...echo, ...more}
    if (LOG_RESPONSE_BODY) {
      console.log(responseBody)
    }
    setTimeout(() => {
      handledRequest++
      if (CONNECTION_CLOSE){
        res.set('connection', 'close')
      }
      res.json(responseBody)
    }, RESONSE_LATENCY)
})

if (LOG_CONNECTION_INTERVAL) {
  setInterval(async() => {
    const connections = await getConnections()
    console.log({connections, handledRequest})
  }, LOG_CONNECTION_INTERVAL)
}

server.listen(PORT, '0.0.0.0', () => {
    console.log(`app listening at http://0.0.0.0:${PORT}`)
})