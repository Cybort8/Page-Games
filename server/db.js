import pg from 'pg'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(import.meta.dirname, '.env') })

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const INITIAL_GAMES = [
  {
    name: 'The Legend of Zelda: Tears of the Kingdom',
    description: 'Aventura épica por los cielos y tierras de Hyrule con nuevas habilidades de creación.',
    price: 249900,
    oldPrice: 289900,
    discount: 14,
    category: 'Nintendo Switch',
    type: 'Digital / Código',
    features: ['Mundo abierto', 'Aventura', 'Exclusivo Nintendo'],
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    name: 'Elden Ring',
    description: 'Levántate, Sinluz, y déjate guiar por la gracia para esgrimir el poder del Círculo de Elden.',
    price: 199900,
    oldPrice: 239900,
    discount: 17,
    category: 'PC / Steam',
    type: 'Digital / Clave Steam',
    features: ['Action RPG', 'Souls-like', 'Multijugador'],
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    name: 'Cyberpunk 2077: Phantom Liberty',
    description: 'Aventura de suspense y espionaje ambientada en el nuevo distrito de Dogtown en Night City.',
    price: 139900,
    oldPrice: 159900,
    discount: 12,
    category: 'PlayStation 5',
    type: 'Digital / Código PSN',
    features: ['Mundo abierto', 'RPG', 'Primera persona'],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
  },
  {
    name: 'Halo Infinite',
    description: 'La legendaria saga de Master Chief regresa con la campaña más amplia hasta la fecha.',
    price: 159900,
    oldPrice: 199900,
    discount: 20,
    category: 'Xbox Series X/S',
    type: 'Digital / Xbox Live',
    features: ['Shooter', 'Sci-Fi', 'Multijugador'],
    image: 'https://images.unsplash.com/photo-1612287232230-674b93478950?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  },
  {
    name: 'Super Mario Odyssey',
    description: 'Acompaña a Mario y Cappy en un viaje trotamundos en 3D lleno de secretos y diversión.',
    price: 219900,
    oldPrice: 249900,
    discount: 12,
    category: 'Nintendo Switch',
    type: 'Digital / Código',
    features: ['Plataformas 3D', 'Para toda la familia'],
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
  },
]

export async function initDB() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT DEFAULT '',
        price NUMERIC NOT NULL,
        old_price NUMERIC,
        discount NUMERIC DEFAULT 0,
        category TEXT NOT NULL,
        type TEXT NOT NULL,
        features JSONB DEFAULT '[]'::jsonb,
        image TEXT DEFAULT '',
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      );
    `)

    // Seed admin if not present
    const adminUser = process.env.ADMIN_USERNAME || 'admin'
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123'
    const existingAdmin = await client.query('SELECT id FROM admins WHERE username = $1', [adminUser])
    if (existingAdmin.rows.length === 0) {
      const hash = await bcrypt.hash(adminPass, 10)
      await client.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', [adminUser, hash])
    }

    // Seed products if catalog is empty
    const productCount = await client.query('SELECT count(*) FROM products')
    if (parseInt(productCount.rows[0].count, 10) === 0) {
      for (const game of INITIAL_GAMES) {
        await client.query(
          `INSERT INTO products (name, description, price, old_price, discount, category, type, features, image, is_featured)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            game.name,
            game.description,
            game.price,
            game.oldPrice,
            game.discount,
            game.category,
            game.type,
            JSON.stringify(game.features),
            game.image,
            game.isFeatured,
          ],
        )
      }
    }
  } finally {
    client.release()
  }
}
