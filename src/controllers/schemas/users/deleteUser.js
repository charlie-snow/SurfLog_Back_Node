// Importaciones
import Joi from "joi";

// Crear el esquema para eliminar usuarios como un objeto Joi
const deleteUserSchema = Joi.object({
  // Definimos los parámetros que se validarán con las caracteríscticas que requiramos
  id: Joi.number().integer().positive(),
});
// Exportamos el Schema
export default deleteUserSchema;
