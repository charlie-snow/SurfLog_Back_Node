// Importaciones
import getPool from "../../db/getPool.js";
import genError from "../../utils/helpers.js";

// Definimos el gestor de conexiones a la DB
const pool = await getPool();

const lugaresController = async (req, res, next) => {
  try {
    const query_select = "SELECT * FROM lugares";
    const [lugares] = await pool.query(query_select);

    // En caso de no haber ninguna categoría, generamos el siguiente mensaje de error
    if (!lugares || lugares.length === 0) {
      throw genError("No hay lugares disponibles", 404);
    }

    // Respuesta
    res.send({
      status: "Correcto",
      data: lugares,
    });
  } catch (error) {
    // En caso de error, pasamos el error al middleware de gestión de errores
    next(error);
  }
};

// Exportaciones
export default lugaresController;
