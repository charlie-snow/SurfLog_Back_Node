import mysql from "mysql2/promise";
import { HOST_DB, USER_DB, PASSWORD_DB, PORT_DB, NAME_DB } from "../../env.js";

// Definimos una variable sin valor asignado
let pool;

// Guardamos en una variable una función del gestor de conexiones a la DB
const getPool = async () => {
  try {
    // En caso de no existir, creamos el gestor
    if (!pool) {
      // const poolTemporal = mysql.createPool({
      //   host: HOST_DB,
      //   user: USER_DB,
      //   password: PASSWORD_DB,
      //   port: PORT_DB,
      // });
      // // Creamos la DB
      // await poolTemporal.query(`CREATE DATABASE IF NOT EXISTS ${NAME_DB} `);

      // Agregamos a la variable pool los parámetros necesarios para conectar con la DB
      pool = mysql.createPool({
        host: HOST_DB,
        user: USER_DB,
        password: PASSWORD_DB,
        port: PORT_DB,
        database: NAME_DB,
        dateStrings: true, // This option will return date and time fields as strings
      });
    }
    return pool;
  } catch (error) {
    throw error;
  }
};

// Exportamos la función
export default getPool;
