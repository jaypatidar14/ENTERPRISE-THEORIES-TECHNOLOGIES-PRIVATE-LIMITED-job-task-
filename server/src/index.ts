import 'dotenv/config'
import { createApp } from './app.js'
import { connectDatabase } from './config/db.js'
import { seedFleetAssetsIfNeeded } from './data/seedFleetAssets.js'

declare const process: {
  env: Record<string, string | undefined>
  exit: (code?: number) => never
}

const port = Number(process.env.PORT ?? 4000)
const mongoUri = process.env.MONGODB_URI ?? ''

async function bootstrap() {
  await connectDatabase(mongoUri)
  await seedFleetAssetsIfNeeded()

  const app = createApp()
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Fleet Asset API running on http://localhost:${port}`)
  })
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exit(1)
})
