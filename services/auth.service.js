import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRA } from '../config/jwt.js'
import { Profesor } from '../models/profesor.model.js'
import { Alumno } from '../models/alumno.model.js'

// ---------------------------------------------------------------------------
// SERVICE — autenticación. Habla con la base de datos y con bcrypt/jwt.
// El controller no toca la base directamente: llama a estas funciones.
// ---------------------------------------------------------------------------

// Firma un token con el id y el rol. Úsalo al registrar y al hacer login.
export const firmarToken = (id, rol) =>
  jwt.sign({ id, rol }, JWT_SECRET, { expiresIn: JWT_EXPIRA })

// TODO: registra un profesor.
//   - hashea la password con bcrypt (bcrypt.hash(password, 10))
//   - créalo en la base
//   - devuelve { token, profesor } (sin la password)
export const registrarProfesor = async (datos) => {
  
  const { password, ...datosProfesor } = datos //Separo password del resto de datos

  const passwordHash = await bcrypt.hash(password, 10) //Hasheo de password

  const profesor = await Profesor.create({
    ...datosProfesor,
    password: passwordHash,
  })

  const token = firmarToken(profesor._id, 'profesor')

  const profesorSinPassword = profesor.toObject()
  delete profesorSinPassword.password

  return {
    token,
    profesor: profesorSinPassword,
  }
}

// TODO: registra un alumno (igual que el profesor).
export const registrarAlumno = async (datos) => {
  const { password, ...datosAlumno } = datos

  const passwordHash = await bcrypt.hash(password, 10)

  const alumno = await Alumno.create({
    ...datosAlumno,
    password: passwordHash,
  })

  const token = firmarToken(alumno._id, 'alumno')

  const alumnoSinPassword = alumno.toObject()
  delete alumnoSinPassword.password

  return {
    token,
    alumno: alumnoSinPassword,
  }
}

// TODO: login.
//   - busca al usuario por email (en Profesor y en Alumno)
//   - compara la password con bcrypt.compare(...)
//   - si coincide, devuelve { token, rol } con el rol correcto
//   - si no, devuelve null (para que el controller responda 401)
export const login = async (email, password) => {
  let usuario = await Profesor.findOne({ email })

  let rol = 'profesor'

  //Si no se encuentra un profesor con ese email, se busca un alumno.
  if (!usuario) {
    usuario = await Alumno.findOne({ email })
    rol = 'alumno'
  }

  //Si no se encuentra ni profesor ni alumno, se devuelve null.
  if (!usuario) {
    return null
  }

  const passwordCorrecta = await bcrypt.compare(
    password,
    usuario.password,
  )

  if (!passwordCorrecta) {
    return null
  }

  const token = firmarToken(usuario._id, rol)

  return {
    token,
    rol,
  }
}
