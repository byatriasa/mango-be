// environment variables
import 'dotenv/config'

// express
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// routes
import routes from '~/routers'

// global middlewares
import logRequest from '~/middlewares/logRequest'
import notFoundHandler from '~/middlewares/notFoundHandler'
import errorHandler from '~/middlewares/errorHandler'

// instances
import db from '~/instances/db'

// ---------------------------------------------

async function serve(): Promise<void> {
  await db.connect()

  // load enviroment variables
  const port = process.env.PORT ?? 8080

  // initialize express app
  const app = express()

  // cors setting
  app.use(
    cors({
      credentials: true,
      origin:
        // only filter origin in production
        process.env.NODE_ENV === 'development'
          ? true
          : (process.env.CORS_ORIGIN as string).split('|')
    })
  )

  // set default transfer data type to json
  app.use(express.json())

  // parse binary request
  app.use(
    express.raw({
      type: 'application/*',
      limit: '10mb'
    })
  )

  // parse cookie
  app.use(cookieParser())

  app.use(logRequest)

  // main router
  app.use('/', routes)

  // not found handler
  app.use(notFoundHandler)

  // general error handling
  app.use(errorHandler)

  app.listen(port, () => {
    console.log(`[server]: Server is running at port :${port}`)
  })
}

serve().catch((err) => {
  console.error(err)
  process.exit(1)
})
