// Importaciones
import getPool from "../../db/getPool.js";
import genError from "../../utils/helpers.js";
import mysql from "mysql2/promise";

const pool = await getPool();

const getLugar = async (id) => {
  const consulta_query = `SELECT * FROM lugares WHERE id = ?`;
  const consulta_valores = [id];
  const consulta = mysql.format(consulta_query, consulta_valores);

  console.log("\x1b[38;5;214m%s\x1b[0m", "Consulta SQL: " + consulta);
  try {
    const [[lugar]] = await pool.query(consulta_query, consulta_valores);

    if (!lugar) {
      throw genError("No hay coincidencias en tu búsqueda: " + consulta, 404);
    }

    return lugar;
  } catch (error) {
    // En caso de error pasamos el error al middleware de gestión de errores
    throw genError("Error recuperando lugar" + consulta, 500);
  }
};

// Exportaciones
export default getLugar;
