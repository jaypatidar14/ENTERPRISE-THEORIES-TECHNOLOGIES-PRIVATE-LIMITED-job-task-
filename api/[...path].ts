import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createApp } from '../server/src/app.js'
import { connectDatabase } from '../server/src/config/db.js'
import { seedFleetAssetsIfNeeded } from '../server/src/data/seedFleetAssets.js'

const app = createApp()
let databaseReady: Promise<void> | undefined

function initializeDatabase() {
  databaseReady ??= connectDatabase(process.env.MONGODB_URI ?? '').then(
    () => seedFleetAssetsIfNeeded()
  )
  return databaseReady
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await initializeDatabase()
    app(req, res)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Database connection failed.',
    })
  }
}