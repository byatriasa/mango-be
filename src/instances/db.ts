import mongoose from 'mongoose'

const CONNECTION_OPTIONS: mongoose.ConnectOptions = {}

async function connect(): Promise<void> {
  try {
    mongoose.set('strictQuery', true) // to suppress warning

    await mongoose.connect(
      process.env.MONGODB_URL as string,
      CONNECTION_OPTIONS
    )
    await mongoose.connection.syncIndexes()

    console.info('[DB]: database initialized')

    mongoose.connection.on('connected', function () {
      console.info('[DB]: connection established successfully')
    })

    mongoose.connection.on('disconnected', () => {
      console.info('[DB]: database disconnected')
    })

    mongoose.connection.on('error', (err) => {
      console.info('[DB]: database error', err)
    })

    mongoose.connection.on('reconnect', () => {
      console.info('[DB]: reconnecting database')
    })

    mongoose.connection.on('reconnectFailed', (err) => {
      console.info('[DB]: failed to reconnect to database', err)
    })
  } catch (err) {
    console.error('[DB]: unable to initialize connection to database', err)
  }
}

const db = {
  conn: mongoose.connection,
  connect
}

export default db
