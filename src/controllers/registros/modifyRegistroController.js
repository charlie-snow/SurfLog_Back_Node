import genError from "../../utils/helpers.js";
// import { insertRegistro } from "../../models/registros/index.js";
// import { insertAdjuntos } from "../../models/adjuntos/index.js";
// import getMDatosLugar from "../lugares/getMDatosLugar.js";
import modifyRegistro from "../../models/registros/modifyRegistro.js";
import getLugar from "../../models/lugares/getLugar.js";

// formatear la fecha del momento para poder insertarla en la base de datos
function formatearMomento(momento) {
  const date = new Date(momento);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const modifyRegistroController = async (req, res, next) => {
  try {
    let ruta_adjuntos_registros = "registros/";

    const { id } = req.params;
    const pruebas = req.query.pruebas;

    let {
      lugar_id,
      momento,
      usuario_id,
      altura_marea,
      altura_ola,
      direccion_ola,
      direccion_viento,
      foto_sesion,
      fotos,
      videos,
      fotos_sesion,
      gente,
      lluvia,
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
    } = req.body;

    momento = formatearMomento(momento);

    if (pruebas === "true") {
      // ruta_registros_back += "pruebas/";
      ruta_adjuntos_registros += "pruebas/";
    }

    const lugar = await getLugar(lugar_id);

    if (!lugar) {
      throw genError("El lugar especificado no existe", 400);
    }

    await modifyRegistro({
      id,
      lugar_id,
      usuario_id,
      altura_marea,
      altura_ola,
      direccion_ola,
      direccion_viento,
      foto_sesion,
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
    });

    // if (registro_id) {
    //   // Si se ha insertado bien el registro, insertar los adjuntos
    //   // Si se enviaron imágenes, copiarlas al servidor e insertar las rutas en la BD
    //   if (fotos) {
    //     await insertAdjuntos(fotos, registro_id, pruebas, "foto");
    //   }
    //   if (videos) {
    //     await insertAdjuntos(videos, registro_id, pruebas, "video");
    //   }
    // } else {
    //   console.log(
    //     "No se han podido insertar los adjuntos por error insertando registro"
    //   );
    // }

    // Respuesta
    res.status(200).json({
      message: "Registro modificado con éxito!",
    });
  } catch (error) {
    const statusCode = error.httpStatus || 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message || "Error del servidor",
    });
  }
};

// Exportaciones
export default modifyRegistroController;
