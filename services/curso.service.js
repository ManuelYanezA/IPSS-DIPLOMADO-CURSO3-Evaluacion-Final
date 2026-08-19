import { Curso } from '../models/curso.model.js'

// ---------------------------------------------------------------------------
// SERVICE — cursos. Habla con la base de datos.
// Las REGLAS DE NEGOCIO (validar estado, propiedad, etc.) pueden ir aquí o en
// el controller: tú decides, pero que estén en el servidor, no en el cliente.
// ---------------------------------------------------------------------------

// TODO: implementa las funciones que tus controllers necesiten. Por ejemplo:
//   - listarCursos()            → Curso.find().populate('profesor').populate('alumnos')
//   - crearCurso(datos)
//   - buscarCurso(id)
//   - editarCurso(id, datos)
//   - borrarCurso(id)
//   - cursosDelProfesor(profesorId)
//   - cursosDelAlumno(alumnoId)
//
// Piensa qué necesita cada ruta y crea solo lo que uses.

//Listar cursos con populate de profesor y alumnos
export const listarCursos = async () => {
  return await Curso.find().populate('profesor','-password').populate('alumnos','-password')
}

//Crear curso con datos por defecto
export const crearCurso = async (datos) => {
  const curso = await Curso.create({
    nombre: datos.nombre,
    fechaInicio: datos.fechaInicio,
    fechaTermino: datos.fechaTermino,
    estado: 'EN_MATRICULA',
    alumnos: [],
  })

  return curso
}

//Buscar curso
export const buscarCurso = async (id) => {
  return await Curso.findById(id)
}

//Editar curso
export const editarCurso = async (id, datos) => {
  const datosPermitidos = {
    nombre: datos.nombre,
    fechaInicio: datos.fechaInicio,
    fechaTermino: datos.fechaTermino,
    estado: datos.estado,
  }

  return await Curso.findByIdAndUpdate(
    id,
    datosPermitidos,
    {
      new: true,
      runValidators: true,
    },
  )
}

//Borrar curso
export const borrarCurso = async (id) => {
  return await Curso.findByIdAndDelete(id)
}

//Cursos del profesor
export const cursosDelProfesor = async (profesorId) => {
  return await Curso.find({profesor: profesorId}).populate('profesor','-password').populate('alumnos','-password')
}

//Cursos del alumno
export const cursosDelAlumno = async (alumnoId) => {
  return await Curso.find({alumnos: alumnoId}).populate('profesor','-password').populate('alumnos','-password')
}

//Alumnos del curso
export const alumnosDelCurso = async (cursoId, profesorId) => {
  
    const curso = await Curso.findById(cursoId).populate('alumnos','-password')

  if (!curso) {
    return null
  }

  if (!curso.profesor || curso.profesor.toString() !== profesorId.toString()) {
    return {sinPermiso: true}
  }

  return {alumnos: curso.alumnos}
}

//Matriculas del alumno
export const misMatriculas = async (alumnoId) => {
  return await Curso.find({alumnos: alumnoId}).populate('profesor','-password').populate('alumnos','-password')
}

//Asignar profesor a un curso
export const asignarme = async (cursoId, profesorId) => {
  const curso = await Curso.findById(cursoId)

  if (!curso) {
    return null
  }

  if (curso.profesor) {
    return { conflicto: true }
  }

  curso.profesor = profesorId

  await curso.save()

  return { curso }
}

//Matricularme en un curso
export const matricularme = async (cursoId, alumnoId) => {
  const curso = await Curso.findById(cursoId)

  if (!curso) {
    return null
  }

  if (curso.estado !== 'EN_MATRICULA') {
    return {cerrado: true}
  }

  const yaMatriculado = curso.alumnos.some(
    (id) => id.toString() === alumnoId.toString(),
  )

  if (yaMatriculado) {
    return {yaMatriculado: true}
  }

  curso.alumnos.push(alumnoId)

  await curso.save()

  return {curso}
}

//Desmatricularme de un curso
export const desmatricularme = async (cursoId, alumnoId) => {
  const curso = await Curso.findById(cursoId)

  if (!curso) {
    return null
  }

  if (curso.estado !== 'EN_MATRICULA') {
    return {cerrado: true}
  }

  curso.alumnos = curso.alumnos.filter((id) => id.toString() !== alumnoId.toString())

  await curso.save()

  return {curso}
}