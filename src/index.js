const express = require('express')
const http = require('http')
const os = require('os')
const app = express()
const port = process.env.PORT
const server = http.createServer(app);

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

app.get('/', async (req, res) => {
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
//    console.log(responseBody)
    res.json(responseBody)
})

setInterval(async() => {
  console.log(await getConnections())
}, 500)

server.listen(port, '0.0.0.0', () => {
    console.log(`app listening at http://0.0.0.0:${port}`)
})