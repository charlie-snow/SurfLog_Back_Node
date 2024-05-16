// Importaciones
import Joi from "joi";

// Crear el esquema del Login como un objeto Joi
const loginSchema = Joi.object({
  // Definimos los parámetros que se validarán con las caracteríscticas que requiramos
  email: Joi.string().email().required(),

  password: Joi.string()
    .pattern(/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/)
    .required(),
});
// Exportamos el Schema
export default loginSchema;
