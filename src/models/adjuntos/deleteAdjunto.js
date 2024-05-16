// Importaciones
import getPool from "../../db/getPool.js";
import genError from "../../utils/helpers.js";
import mysql from "mysql2/promise";

// Definimos el gestor de conexiones a la DB
const pool = await getPool();

// const deleteRegistro = async (req, res, next) => {
const deleteRegistro = async (id, pruebas) => {
  try {
    // Guardamos en una variable la id extraida de los parámetros de la request
    const sqlValues = [id];
    let tabla = "registros";
    if (pruebas === "true") {
      tabla = tabla + "_pruebas";
    }

    const sqlQuery = `DELETE FROM ${tabla} WHERE id = ?`;

    const consulta = mysql.format(sqlQuery, sqlValues);
    console.log(">>> Consulta SQL: " + consulta);

    await pool.query(sqlQuery, sqlValues);

    console.log(`>>>> Registro ${id} borrado con éxito`);
  } catch (error) {
    // En caso de error pasamos el error al middleware de gestión de errores
    throw genError("Error borrando el registro", 500);
  }
};

export default deleteRegistro;
