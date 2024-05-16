// Importaciones
import Joi from "joi";

// Crear el esquema para verificar el id de una registro concreta como un objeto Joi
const idRegistroSchema = Joi.object({
  // Definimos los parámetros que se validarán con las caracteríscticas que requiramos
  id: Joi.number().integer().positive(),
});
// Exportamos el Schema
export default idRegistroSchema;
