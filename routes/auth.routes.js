import { Router } from 'express'
import * as controller from '../controllers/auth.controller.js'

// ---------------------------------------------------------------------------
// RUTAS — autenticación. Todas públicas (no llevan proteger).
// ---------------------------------------------------------------------------
export const authRoutes = Router()

// TODO: conecta cada ruta con su controller.
authRoutes.post('/registro/profesor', controller.registrarProfesor)
authRoutes.post('/registro/alumno', controller.registrarAlumno)
authRoutes.post('/login', controller.login)
