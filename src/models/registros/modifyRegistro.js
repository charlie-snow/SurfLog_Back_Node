// Importaciones
import getPool from "../../db/getPool.js";
import genError from "../../utils/helpers.js";
import mysql from "mysql2/promise";
import getRegistro from "./getRegistro.js";

const pool = await getPool();

const modifyRegistro = async ({
  id,
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
  let consulta = "";
  let valores = [];
  try {
    // console.log("pruebas:" + pruebas);
    let tabla_registros = "registros";
    if (pruebas === "true") {
      tabla_registros += "_pruebas";
    }
    let tabla_adjuntos = "adjuntos";
    if (pruebas === "true") {
      tabla_adjuntos += "_pruebas";
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

    const registro = await getRegistro(id, pruebas);

    if (!registro) {
      throw genError("El registro especificado no existe", 400);
    }

    // Remove properties with null values
    const filteredValues = Object.fromEntries(
      Object.entries(valuesObject).filter(([_, value]) => value !== "null")
    );

    // console.log(filteredValues);

    consulta = "UPDATE " + tabla_registros + " SET ";
    valores = [];

    for (const [key, value] of Object.entries(filteredValues)) {
      if (value !== undefined) {
        consulta += `${key}=?, `;
        valores.push(value);
      }
    }

    // Remove the last comma and space
    consulta = consulta.slice(0, -2);

    // Add the WHERE clause
    consulta += " WHERE id=?;";
    valores.push(id);

    // Ejecutamos la actualización
    await pool.query(consulta, valores);

    console.log(
      "\x1b[38;5;214m%s\x1b[0m",
      "Consulta SQL realizada con éxito: " + mysql.format(consulta, valores)
    );
  } catch (error) {
    // En caso de haber algun error, lo manejamos
    throw genError(
      "Error modificando el registro: " +
        error +
        mysql.format(consulta, valores),
      500
    );
  }
};

export default modifyRegistro;
