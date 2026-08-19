// ---------------------------------------------------------------------------
// SERVER — arranque de la app. Esto ya está listo: tú construyes lo de adentro.
// ---------------------------------------------------------------------------
import express from 'express'
import cors from 'cors'
import { conectar } from './config/db.js'

// A medida que crees tus routers, descoméntalos:
import { authRoutes } from './routes/auth.routes.js'
import { cursoRoutes } from './routes/curso.routes.js'

const app = express()
app.use(cors())
app.use(express.json())

// Un saludo para saber que el servidor vive.
app.get('/', (req, res) => res.json({ ok: true, api: 'Plataforma de Cursos' }))

// Monta aquí tus rutas (descoméntalas cuando las tengas):
app.use('/api/auth', authRoutes)
app.use('/api/cursos', cursoRoutes)

app.use((req, res) => {
  res.status(404).json({error: 'Ruta no encontrada'})
})

const PORT = 3000

await conectar()

app.listen(PORT, () => {
  console.log(`✅ API escuchando en http://localhost:${PORT}`)
})
