// Importaciones
import Joi from "joi";

// Crear el esquema para insertar una registro como un objeto Joi
const registroSchema = Joi.object({
  // Definimos los parámetros que se validarán con las caracteríscticas que requiramos
  id: Joi.number().integer().positive().required(),

  title: Joi.string()
    .pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿç\s'0-9,.:;!¡?¿()"`~*%#-_@]+$/u)
    .min(3)
    .max(75)
    .required(),

  subTitle: Joi.string()
    .pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿç\s'0-9,.:;!¡?¿()"`~*%#-_@]+$/u)
    .min(3)
    .max(50)
    .required(),

  place: Joi.string()
    .pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿç\s'0-9,.:;!¡?¿()"`~*%#-_@]+$/u)
    .min(3)
    .max(50)
    .required(),

  text: Joi.string()
    .pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿç\s'0-9,.:;!¡?¿()"`~*%#-_@]+$/u)
    .min(20)
    .max(250)
    .required(),

  photoPath: [Joi.string()],

  category: Joi.number().integer().positive().required(),
});
// Exportamos el Schema
export default registroSchema;
