// Importaciones
import getPool from "../../db/getPool.js";
import genError from "../../utils/helpers.js";
import mysql from "mysql2/promise";

// Definimos el gestor de conexiones a la DB
const pool = await getPool();

// Creamos una función donde manejaremos la búsqueda por "id" de una registro en concreto
const getRegistro = async (id, pruebas) => {
  try {
    let tabla_registros = "registros";
    if (pruebas) {
      tabla_registros += "_pruebas";
    }
    let tabla_adjuntos = "adjuntos";
    if (pruebas) {
      tabla_adjuntos += "_pruebas";
    }
    let consulta_query = "";

    const consulta_select = `SELECT
        r.id AS registro_id,
        r.lugar_id,
        l.nombre AS lugar_nombre,
        l.coordenadas AS lugar_coordenadas,
        r.usuario_id,
        u.nombre AS usuario_nombre,
        u.email AS usuario_email,
        r.altura_marea,
        r.altura_ola,
        r.direccion_ola,
        r.direccion_viento,
        r.foto_sesion,
        r.fotos,
        r.fotos_sesion,
        r.gente,
        r.lluvia,
        r.momento,
        r.nubes,
        r.numero_olas,
        r.periodo_ola,
        r.punto_marea,
        r.que_tal_olas,
        r.que_tal_yo,
        r.subiendo_marea,
        r.temperatura_agua,
        r.temperatura_ambiente,
        r.texto,
        r.tiempo,
        r.velocidad_viento,
        GROUP_CONCAT(a.id) AS adjunto_ids,
        GROUP_CONCAT(a.tipo) AS adjunto_tipos,
        GROUP_CONCAT(a.ruta) AS adjunto_ruta
    FROM
        ${tabla_registros} r
    JOIN
        lugares l ON r.lugar_id = l.id
    JOIN
        usuarios u ON r.usuario_id = u.id
    LEFT JOIN
        ${tabla_adjuntos} a ON r.id = a.registro_id`;

    const consulta_un_registro = " WHERE r.id = ?";

    consulta_query = consulta_select + "\n" + consulta_un_registro;
    const consulta_valores = [id];
    const consulta = mysql.format(consulta_query, consulta_valores);

    console.log("\x1b[38;5;214m%s\x1b[0m", "Consulta SQL: " + consulta);

    const [[registro]] = await pool.query(consulta_query, consulta_valores);

    // En caso de no haber ningun registro con la "id" que solicitamos, generamos el siguiente mensaje de error
    if (!registro) {
      throw genError("No hay coincidencias en tu búsqueda", 404);
    } else {
      if (registro.adjunto_ids) {
        const ids_array = registro.adjunto_ids.split(",");
        const tipos_array = registro.adjunto_tipos.split(",");
        const rutas_array = registro.adjunto_ruta.split(",");

        // Combine arrays into an array of objects
        const adjuntos = ids_array.map((id, index) => ({
          id: parseInt(id), // Convert to integer if needed
          tipo: tipos_array[index],
          ruta: rutas_array[index],
        }));
        registro.adjuntos = adjuntos;
      }
    }

    return registro;
  } catch (error) {
    console.log(error);
  }
};

// Exportaciones
export default getRegistro;
