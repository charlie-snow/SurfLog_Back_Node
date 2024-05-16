// Importaciones
import getPool from "../../db/getPool.js";
import genError from "../../utils/helpers.js";
import mysql from "mysql2/promise";
import getRegistro from "./getRegistro.js";
import { deleteFromS3 } from "../../utils/gestorS3.js";

// Definimos el gestor de conexiones a la DB
const pool = await getPool();

// const deleteRegistro = async (req, res, next) => {
const deleteRegistro = async (id, pruebas) => {
  try {
    const sqlValues = [id];

    try {
      await deleteAdjuntos(id, pruebas);
    } catch (error) {
      console.log("Error borrando adjuntos del registro " + id);
      return;
    }

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

const deleteAdjuntos = async (id_registro, pruebas) => {
  try {
    const sqlValues = [id_registro];

    const registro = await getRegistro(id_registro, pruebas);
    console.log("Registro: ");
    console.log(registro);
    registro.adjuntos.map((adjunto) => deleteFromS3(adjunto.ruta));

    let tabla = "adjuntos";
    if (pruebas === "true") {
      tabla = tabla + "_pruebas";
    }

    const sqlQuery = `DELETE FROM ${tabla} WHERE registro_id = ?`;

    const consulta = mysql.format(sqlQuery, sqlValues);
    console.log(">>> Consulta SQL: " + consulta);

    await pool.query(sqlQuery, sqlValues);

    console.log(`>>>> Registro ${id_registro} borrado con éxito`);
  } catch (error) {
    console.log(
      "Error borrando adjuntos del registro " +
        id_registro +
        " - error: " +
        error
    );
  }
};

export default deleteRegistro;
