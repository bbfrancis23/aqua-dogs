import mongoose from 'mongoose'

const connection = {}

const connect = async () => {
  if (connection.isConnected) {
    console.log('already connected')
    return
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = await mongoose.connections[0].readyState

    if (connection.isConnected === 1) {
      console.log('use previous connection')
      return
    }

    await mongoose.disconnect()
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_CONNECT)
    console.log('new connection')
    connection.isConnected = db.connections[0].readyState
  } catch (error) {
    console.log('error connecting to db')
    console.log(error)
    console.log('try conntecting again')
    const db = await mongoose.connect(process.env.MONGO_CONNECT)
    console.log('new connection')
    connection.isConnected = db.connections[0].readyState
  }

  // const db = await mongoose.connect(process.env.MONGO_CONNECT)

  //console.log('new connection')

  // connection.isConnected = await db.connections[0].readyState
}

const disconnect = async () => {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect()
      connection.isConnected = false
    } else {
      console.log('not disconnected')
    }
  }
}

const db = {connect, disconnect}
export default db
