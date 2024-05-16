// Importaciones
import getPool from "../db/getPool.js";
import { HOST_DB, USER_DB, PASSWORD_DB, PORT_DB, NAME_DB } from "../../env.js";

// Definimos el gestor de conexiones a la DB
const pool = await getPool();

const inicioController = async (req, res, next) => {
  try {
    // Respuesta
    // console.log(pool._eventsCount);
    res.send({
      status: "Estás accediendo a la API SurfLog",
      host: HOST_DB,
      // pool_eventsCount: pool._eventsCount,
    });
  } catch (error) {
    // En caso de error, pasamos el error al middleware de gestión de errores
    next(error);
  }
};

// Exportaciones
export default inicioController;
