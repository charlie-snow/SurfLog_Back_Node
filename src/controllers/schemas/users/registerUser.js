// Importaciones
import Joi from "joi";

// Crear el esquema para el registro del usuario como un objeto Joi
const registerSchema = Joi.object({
  // Definimos los parámetros que se validarán con las caracteríscticas que requiramos
  name: Joi.string()
    .pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿç\s'-]+$/u)
    .min(2)
    .max(30)
    .required(),

  lastName: Joi.string()
    .pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿç\s'-]+$/u)
    .min(2)
    .max(30)
    .required(),

  email: Joi.string().email().required(),

  password: Joi.string()
    .pattern(/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/)
    .required(),
});
// Exportamos el Schema
export default registerSchema;
