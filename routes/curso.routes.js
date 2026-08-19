import { Router } from 'express'
import * as controller from '../controllers/curso.controller.js'
import { proteger, soloRol } from '../middlewares/proteger.js'

// ---------------------------------------------------------------------------
// RUTAS — cursos. La mayoría van protegidas y con rol.
// Recuerda: todo lo de aquí exige token. Pon `proteger` (y `soloRol` donde
// corresponda) delante del controller.
// ---------------------------------------------------------------------------
export const cursoRoutes = Router()

// TODO: conecta cada ruta. Ejemplos de la forma (ver enunciado para el detalle):
//
//  ── Profesor ──
cursoRoutes.get('/', proteger, soloRol('profesor'), controller.listar)
cursoRoutes.post('/', proteger, soloRol('profesor'), controller.crear)
cursoRoutes.get('/mis-cursos', proteger, soloRol('profesor'), controller.misCursos)
cursoRoutes.put('/:id', proteger, soloRol('profesor'), controller.editar)
cursoRoutes.delete('/:id', proteger, soloRol('profesor'), controller.borrar)
cursoRoutes.post('/:id/asignarme', proteger, soloRol('profesor'), controller.asignarme)
cursoRoutes.get('/:id/alumnos', proteger, soloRol('profesor'), controller.alumnosDelCurso)
//
//  ── Alumno ──
cursoRoutes.get('/mis-matriculas', proteger, soloRol('alumno'), controller.misMatriculas)
cursoRoutes.post('/:id/matricularme', proteger, soloRol('alumno'), controller.matricularme)
cursoRoutes.delete('/:id/matricularme', proteger, soloRol('alumno'), controller.desmatricularme)
//
// ⚠️ OJO con el orden: las rutas fijas (/mis-cursos) van ANTES que las
//    dinámicas (/:id), o Express interpretará "mis-cursos" como un :id.
