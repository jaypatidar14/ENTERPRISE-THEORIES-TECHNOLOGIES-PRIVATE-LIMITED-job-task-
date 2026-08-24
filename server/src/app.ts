import express from 'express'
import cors from 'cors'
import { fleetAssetRoutes } from './routes/fleetAssetRoutes.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: true,
    })
  )
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.use('/api/fleet-assets', fleetAssetRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
