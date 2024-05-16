// Importaciones
import getPool from "../../db/getPool.js";
import { HOST_DB, NAME_DB } from "../../../env.js";

// Importamos e usamos el gestor de conexión a la DB
const pool = await getPool();

// Creamos una función para listar regeriencias con opciones de filtrado donde busca y extrae las coincidencias en las regeriencias publicadas buscando en lugares y categorías, y es capaz de orodenar por votos, según los parámetros introducidos
const getRegistrosController = async (req, res, next, pruebas) => {
  try {
    // declaramos las variables con partes de sql para hacer combinaciones
    let tabla_registros = "registros";
    if (pruebas) {
      tabla_registros += "_pruebas";
    }
    let tabla_adjuntos = "adjuntos";
    if (pruebas) {
      tabla_adjuntos += "_pruebas";
    }
    let consulta = "";

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
        ${tabla_adjuntos} a ON r.id = a.registro_id
    GROUP BY r.id`;
    const consulta_orden = ` ORDER BY r.id`;

    consulta = consulta_select + consulta_orden;
    console.log("Consulta SQL: " + consulta);
    const [lista] = await pool.query(consulta);

    lista.map((registro) => {
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
    });

    // adjunto la ruta al servidor de bd, para verlo en el front siendo admin
    lista.bd = HOST_DB + "/" + NAME_DB;

    // console.log(list);
    res.send({
      status: "Correcto",
      data: lista,
    });
  } catch (error) {
    // En caso de error pasamos el error al middleware de gestión de errores
    next(error);
  }
};

// Exportamos la función
export default getRegistrosController;
