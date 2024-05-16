import { deleteRegistro } from "../../models/registros/index.js";

// Creamos una función para borrar una registro tuya, previamente autorizado con TOKEN y en ella comprobamos si eres el dueño de la registro antes de poder borrarla
const deleteRegistroController = async (req, res, next) => {
  try {
    // Guardamos en una variable la id extraida de los parámetros de la request
    const { id } = req.params;
    const pruebas = req.query.pruebas;

    await deleteRegistro(id, pruebas);

    // Respuesta
    res.status(200).json({
      message: `Registro ${id} borrado con éxito!`,
    });
  } catch (error) {
    const statusCode = error.httpStatus || 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message || `Error eliminando el registro ${id}`,
    });
  }
};

export default deleteRegistroController;
