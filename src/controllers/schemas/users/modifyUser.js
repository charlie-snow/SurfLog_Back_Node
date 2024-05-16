// Importaciones
import Joi from "joi";

// Crear el esquema para la modificación del usuario como un objeto Joi
const modifyUserSchema = Joi.object({
  // Definimos los parámetros que se validarán con las caracteríscticas que requiramos
  name: Joi.string()
    .pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿç\s'-]+$/u)
    .min(2)
    .max(30),

  lastName: Joi.string()
    .pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿç\s'-]+$/u)
    .min(2)
    .max(30),

  email: Joi.string().email(),

  password: Joi.string().pattern(
    /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/
  ),
});
// Exportamos el Schema
export default modifyUserSchema;
