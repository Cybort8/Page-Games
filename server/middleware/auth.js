import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'No autorizado. Token no proporcionado.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'videojuegos-super-secret-key')
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado.' })
  }
}
