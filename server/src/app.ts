// @ts-expect-error Express type declarations are not installed in this project.
import express from 'express'
import cors from 'cors'
import { fleetAssetRoutes } from './routes/fleetAssetRoutes.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

interface HealthResponse {
  ok: boolean
}

interface Request {}

interface Response<T = unknown> {
  json: (body: T) => void
}

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: true,
    })
  )
  app.use(express.json())

  app.get('/health', (_req: Request, res: Response<HealthResponse>) => {
    res.json({ ok: true })
  })

  app.use('/api/fleet-assets', fleetAssetRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
