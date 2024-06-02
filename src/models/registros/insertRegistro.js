// Importaciones
import getPool from "../../db/getPool.js";
import genError from "../../utils/helpers.js";
import mysql from "mysql2/promise";

const pool = await getPool();

const insertRegistro = async ({
  lugar_id,
  usuario_id,
  altura_marea,
  altura_ola,
  direccion_ola,
  direccion_viento,
  foto_sesion,
  // fotosRuta,
  fotos_sesion,
  gente,
  lluvia,
  momento,
  nubes,
  numero_olas,
  periodo_ola,
  punto_marea,
  que_tal_olas,
  que_tal_yo,
  subiendo_marea,
  temperatura_agua,
  temperatura_ambiente,
  texto,
  tiempo,
  velocidad_viento,
  pruebas,
}) => {
  try {
    // console.log("pruebas:" + pruebas);
    let tabla = "registros";
    if (pruebas === "1") {
      tabla = tabla + "_pruebas";
    }
    const valuesObject = {
      lugar_id,
      usuario_id,
      altura_marea,
      altura_ola,
      direccion_ola,
      direccion_viento,
      foto_sesion,
      // fotos: fotosRuta,
      fotos_sesion,
      gente,
      lluvia,
      momento,
      nubes,
      numero_olas,
      periodo_ola,
      punto_marea,
      que_tal_olas,
      que_tal_yo,
      subiendo_marea,
      temperatura_agua,
      temperatura_ambiente,
      texto,
      tiempo,
      velocidad_viento,
    };

    const filteredValues = Object.fromEntries(
      Object.entries(valuesObject).filter(([_, value]) => value !== "null")
    );

    let sqlValues = [filteredValues];
    console.log(sqlValues);
    // Generate SQL query and values
    const sqlQuery = `INSERT INTO ${tabla} SET ?`;
    const consulta = mysql.format(sqlQuery, sqlValues);

    // const consulta = mysql.format(sqlQuery, sqlValues);
    console.log("\x1b[38;5;214m%s\x1b[0m", "Consulta SQL: " + consulta);

    // Realizamos la petición a la DB
    const [{ insertId }] = await pool.query(sqlQuery, sqlValues);
    console.log("insertId: " + insertId);
    return insertId;
  } catch (error) {
    // En caso de haber algun error, lo manejamos
    throw genError("Error insertando el registro", 500);
  }
};

// Exportaciones
export default insertRegistro;
