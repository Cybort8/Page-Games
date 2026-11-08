import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { initDB } from './db.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'

dotenv.config({ path: path.join(import.meta.dirname, '.env') })

const app = express()
const PORT = process.env.PORT || 3000

// Allow all origins for dev/preview ease
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static uploads serving
app.use('/uploads', express.static(path.resolve('uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// Initialize database and start server
async function start() {
  try {
    await initDB()
    console.log('Base de datos conectada e inicializada con éxito.')

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Error al inicializar el servidor:', err)
    process.exit(1)
  }
}

start()
