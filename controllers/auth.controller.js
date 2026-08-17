import * as service from '../services/auth.service.js'

// ---------------------------------------------------------------------------
// CONTROLLERS — autenticación.
// Cada uno recibe la petición, llama al service, y responde con el status
// correcto. Envuelve todo en try/catch para no reventar el servidor.
// ---------------------------------------------------------------------------

// POST /api/auth/registro/profesor
export const registrarProfesor = async (req, res) => {
  try {
    // TODO: llama al service para crear el profesor (con la password hasheada)
    //       y devuelve su token. Status 201.
    //       Recuerda: NO devuelvas la password en la respuesta.
    const { password, ...datosProfesor } = datos

    const passwordHash = await bcrypt.hash(password, 10)

    const profesor = await Profesor.create({
      ...datosProfesor,
      password: passwordHash,
    })

    const token = firmarToken(profesor._id, 'PROFESOR')

    const profesorSinPassword = profesor.toObject()
    delete profesorSinPassword.password

    return {
      token,
      profesor: profesorSinPassword,
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// POST /api/auth/registro/alumno
export const registrarAlumno = async (req, res) => {
  try {
    // TODO: igual que el profesor, pero para el alumno.
    const { password, ...datosAlumno } = datos

    const passwordHash = await bcrypt.hash(password, 10)

    const alumno = await Alumno.create({
      ...datosAlumno,
      password: passwordHash,
    })

    const token = firmarToken(alumno._id, 'ALUMNO')

    const alumnoSinPassword = alumno.toObject()
    delete alumnoSinPassword.password

    return {
      token,
      alumno: alumnoSinPassword,
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// POST /api/auth/login
export const login = async (email, password) => {
  try {
    // TODO:
    //   1. Recibe email y password del body.
    //   2. Busca al usuario (¿profesor o alumno? decide cómo lo resuelves).
    //   3. Compara la password con bcrypt.
    //   4. Si no coincide → 401.
    //   5. Si coincide → firma un token que incluya el id y el ROL, y devuélvelo.
    let usuario = await Profesor.findOne({ email })
    let rol = 'PROFESOR'

    if (!usuario) {
      usuario = await Alumno.findOne({ email })
      rol = 'ALUMNO'
    }

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
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
