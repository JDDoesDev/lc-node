/* eslint-disable no-console */
import express from 'express'
import http from 'http'
import https from 'https'
import socketIo from 'socket.io'
import cors from 'cors'

import index from './routes/index'


const port = process.env.PORT || 4001
const app = express()


app.use(cors())
app.use(index)

const server = http.createServer(app)
const io = socketIo(server) // < Interesting!

io.origins('*:*')

io.on('connection', (socket) => {
  let room

  console.log('New client connected')

  socket.emit('hello world', 'this is working!')

  socket.on('captioned', (data) => {
    socket.broadcast.to(room).emit('captioned', data)
  })

  socket.on('room', (data, ack) => {
    room = data
    console.log(`Joined room ${room}`)
    socket.join(data)
    ack(true)
  })

  socket.on('disconnect', () => console.log('Client disconnected'))
})

server.listen(port, () => console.log(`Listening on port ${port}`))
