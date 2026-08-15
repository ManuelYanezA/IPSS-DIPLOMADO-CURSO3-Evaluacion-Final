import mongoose from 'mongoose'

// ---------------------------------------------------------------------------
// MODELO — Alumno.
// ---------------------------------------------------------------------------
// TODO: define el schema del alumno. Campos (ver enunciado):
//   - nombre    (texto, obligatorio)
//   - email     (texto, único, obligatorio)
//   - telefono  (texto)
//   - password  (texto, obligatorio) → HASHEADO con bcrypt

const alumnoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    telefono: {
      type: String
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true },
)

export const Alumno = mongoose.model('Alumno', alumnoSchema, 'alumnos')
