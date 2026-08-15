import mongoose from 'mongoose'

// ---------------------------------------------------------------------------
// MODELO — Curso. El más importante: aquí viven las RELACIONES.
// ---------------------------------------------------------------------------
// TODO: define el schema del curso. Campos (ver enunciado):
//   - nombre        (texto, obligatorio)
//   - fechaInicio   (fecha, obligatoria)
//   - fechaTermino  (fecha, obligatoria)
//   - estado        (solo 'EN_MATRICULA' o 'CERRADO'; por defecto 'EN_MATRICULA')
//                     → pista: { type: String, enum: [...], default: ... }
//   - profesor      (REFERENCIA a un Profesor: ObjectId, ref: 'Profesor')
//                     → puede ser null (un curso puede no tener profesor todavía)
//   - alumnos       (ARRAY de referencias a Alumno: [{ type: ObjectId, ref: 'Alumno' }])
//                     → empieza vacío
//
// Recuerda: el curso guarda los IDs, no los datos. Para traer los nombres
// usarás .populate() cuando listes los cursos.

const cursoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    fechaInicio: {
      type: Date,
      required: true
    },
    fechaTermino: {
      type: Date,
      required: true
    },
    estado: {
      type: String,
      enum: ['EN_MATRICULA','CERRADO'],
      default: 'EN_MATRICULA'
    },
    profesor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profesor'
    },
    alumnos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alumno'
    }]
  },
  { timestamps: true },
)

export const Curso = mongoose.model('Curso', cursoSchema, 'cursos')
