import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'

const router = Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ message: 'Se requieren usuario y contraseña.' })
  }

  try {
    const { rows } = await pool.query('SELECT * FROM admins WHERE username = $1', [username])
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas.' })
    }

    const admin = rows[0]
    const valid = await bcrypt.compare(password, admin.password_hash)
    if (!valid) {
      return res.status(401).json({ message: 'Credenciales inválidas.' })
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'videojuegos-super-secret-key',
      { expiresIn: '7d' },
    )

    return res.json({ token })
  } catch (err) {
    console.error('Error en /api/auth/login:', err)
    return res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

export default router
