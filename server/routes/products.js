import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Ensure upload directory exists
const uploadDir = path.join(import.meta.dirname, '..', 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '')
    cb(null, `${Date.now()}-${base}${ext}`)
  },
})

const upload = multer({ storage })

function formatProduct(row, req) {
  let image = row.image || ''
  if (image && !image.startsWith('http://') && !image.startsWith('https://')) {
    const proto = req.headers['x-forwarded-proto'] || req.protocol
    const host = req.get('host')
    image = `${proto}://${host}${image.startsWith('/') ? '' : '/'}${image}`
  }

  return {
    _id: row.id,
    name: row.name,
    description: row.description || '',
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : null,
    discount: row.discount != null ? Number(row.discount) : 0,
    category: row.category,
    type: row.type,
    features: Array.isArray(row.features) ? row.features : [],
    image,
    isFeatured: Boolean(row.is_featured),
    createdAt: row.created_at,
  }
}

function extractFeatures(body) {
  if (Array.isArray(body.features)) {
    return body.features.filter(Boolean)
  }
  const features = []
  for (const key of Object.keys(body)) {
    const match = key.match(/^features\[(\d+)\]$/)
    if (match) {
      features[parseInt(match[1], 10)] = body[key]
    }
  }
  return features.filter(Boolean)
}

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY created_at DESC')
    res.json(rows.map((row) => formatProduct(row, req)))
  } catch (err) {
    console.error('Error fetching products:', err)
    res.status(500).json({ message: 'Error al consultar productos.' })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado.' })
    }
    res.json(formatProduct(rows[0], req))
  } catch (err) {
    console.error('Error fetching product:', err)
    res.status(500).json({ message: 'Error al consultar el producto.' })
  }
})

// POST /api/products
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const b = req.body
    const features = extractFeatures(b)
    const image = req.file ? `/uploads/${req.file.filename}` : (b.image || '')

    const { rows } = await pool.query(
      `INSERT INTO products (name, description, price, old_price, discount, category, type, features, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        b.name || 'Sin nombre',
        b.description || '',
        Number(b.price) || 0,
        b.oldPrice ? Number(b.oldPrice) : null,
        b.discount ? Number(b.discount) : 0,
        b.category || 'General',
        b.type || 'Digital',
        JSON.stringify(features),
        image,
      ],
    )

    res.status(201).json(formatProduct(rows[0], req))
  } catch (err) {
    console.error('Error creating product:', err)
    res.status(500).json({ message: 'Error al crear el producto.' })
  }
})

// PUT /api/products/:id
router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    let payload = req.body
    if (req.body.data) {
      try {
        payload = JSON.parse(req.body.data)
      } catch {
        payload = req.body
      }
    }

    const features = extractFeatures(payload)
    const existing = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id])
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado.' })
    }

    const currentImage = existing.rows[0].image
    const image = req.file ? `/uploads/${req.file.filename}` : (payload.image !== undefined ? payload.image : currentImage)

    const { rows } = await pool.query(
      `UPDATE products
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           old_price = $4,
           discount = COALESCE($5, discount),
           category = COALESCE($6, category),
           type = COALESCE($7, type),
           features = $8,
           image = $9
       WHERE id = $10
       RETURNING *`,
      [
        payload.name,
        payload.description,
        payload.price != null ? Number(payload.price) : null,
        payload.oldPrice != null ? Number(payload.oldPrice) : null,
        payload.discount != null ? Number(payload.discount) : null,
        payload.category,
        payload.type,
        JSON.stringify(features),
        image,
        req.params.id,
      ],
    )

    res.json(formatProduct(rows[0], req))
  } catch (err) {
    console.error('Error updating product:', err)
    res.status(500).json({ message: 'Error al actualizar el producto.' })
  }
})

// PATCH /api/products/:id/highlight
router.patch('/:id/highlight', requireAuth, async (req, res) => {
  try {
    const { isFeatured } = req.body
    const { rows } = await pool.query(
      `UPDATE products SET is_featured = $1 WHERE id = $2 RETURNING *`,
      [Boolean(isFeatured), req.params.id],
    )
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado.' })
    }
    res.json(formatProduct(rows[0], req))
  } catch (err) {
    console.error('Error toggling highlight:', err)
    res.status(500).json({ message: 'Error al destacar producto.' })
  }
})

// DELETE /api/products/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id])
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Producto no encontrado.' })
    }
    res.json({ success: true, message: 'Producto eliminado correctamente.' })
  } catch (err) {
    console.error('Error deleting product:', err)
    res.status(500).json({ message: 'Error al eliminar el producto.' })
  }
})

export default router
