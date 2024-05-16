// Importaciones
import getPool from "../../db/getPool.js";
import genError from "../../utils/helpers.js";
import mysql from "mysql2/promise";

// Guardamos en una variable el gestor de conexiones a la DB
const pool = await getPool();

// Creamos una función para insertar una registro en la DB
const insertAdjunto = async ({ registro_id, tipo, ruta, pruebas }) => {
  try {
    // console.log("pruebas:" + pruebas);
    let tabla = "adjuntos";
    if (pruebas === "1") {
      tabla = tabla + "_pruebas";
    }
    const consulta_campos = { registro_id, tipo, ruta };
    console.log(consulta_campos);
    // Remove properties with null values
    // const filteredValues = Object.fromEntries(
    //   Object.entries(valuesObject).filter(([_, value]) => value !== "null")
    // );

    // Generate SQL query and values
    const consulta_select = `INSERT INTO ${tabla} SET ?`;
    const consulta = mysql.format(consulta_select, consulta_campos);

    // const consulta = mysql.format(sqlQuery, sqlValues);
    console.log("Consulta SQL: " + consulta);

    // Realizamos la petición a la DB
    const [{ insertId }] = await pool.query(consulta_select, consulta_campos);

    // return insertId;
  } catch (error) {
    // En caso de haber algun error, lo manejamos
    throw genError("Error insertando el registro", 500);
  }
};

// Exportaciones
export default insertAdjunto;
