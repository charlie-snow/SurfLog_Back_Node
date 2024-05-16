import genError from "../../utils/helpers.js";
import { insertRegistro } from "../../models/registros/index.js";
import { insertAdjunto } from "../../models/adjuntos/index.js";
import getMDatosLugar from "../lugares/getMDatosLugar.js";
import getLugar from "../../models/lugares/getLugar.js";

const insertarAdjuntos = async (adjuntos, registro_id, pruebas, tipo) => {
  try {
    let adjuntos_array = [];
    if (adjuntos instanceof Array) {
      adjuntos_array = adjuntos;
    } else if (adjuntos) {
      adjuntos_array = [adjuntos];
    }

    await Promise.all(
      adjuntos_array.map(async (adjunto) => {
        await insertAdjunto({
          registro_id,
          tipo: tipo,
          ruta: adjunto,
          pruebas,
        });
      })
    );
  } catch (error) {
    console.log(
      "\x1b[38;5;214m%s\x1b[0m",
      "XXXXXXXX - ERROR INSERTANDO O SUBIENDO ADJUNTOS: " + error
    );
  }
};

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

const insertRegistroController = async (req, res, next) => {
  try {
    let ruta_adjuntos_registros = "registros/";

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
      pruebas,
    } = req.body;

    momento = formatearMomento(momento);

    if (pruebas === "1") {
      // ruta_registros_back += "pruebas/";
      ruta_adjuntos_registros += "pruebas/";
    }

    const lugar = await getLugar(lugar_id);

    if (!lugar) {
      throw genError("El lugar especificado no existe", 400);
    }

    const mdatos_lugar = await getMDatosLugar(lugar, momento);

    altura_marea = mdatos_lugar.altura_marea;
    altura_ola = mdatos_lugar.altura_ola;
    direccion_ola = mdatos_lugar.direccion_ola;
    direccion_viento = mdatos_lugar.direccion_viento;
    lluvia = mdatos_lugar.lluvia;
    nubes = mdatos_lugar.nubes;
    periodo_ola = mdatos_lugar.periodo_ola;
    punto_marea = mdatos_lugar.punto_marea;
    subiendo_marea = mdatos_lugar.subiendo_marea;
    temperatura_agua = mdatos_lugar.temperatura_agua;
    temperatura_ambiente = mdatos_lugar.temperatura_ambiente;
    tiempo = mdatos_lugar.tiempo;
    velocidad_viento = mdatos_lugar.velocidad_viento;

    // Llamamos a la función encargada de insertar los datos de la registro(Ver explicación en su respectivo lugar)
    const registro_id = await insertRegistro({
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

    if (registro_id) {
      // Si se ha insertado bien el registro, insertar los adjuntos
      // Si se enviaron imágenes, copiarlas al servidor e insertar las rutas en la BD
      if (fotos) {
        await insertarAdjuntos(fotos, registro_id, pruebas, "foto");
      }
      if (videos) {
        await insertarAdjuntos(videos, registro_id, pruebas, "video");
      }
    } else {
      console.log(
        "No se han podido insertar los adjuntos por error insertando registro"
      );
    }

    // Respuesta
    res.status(200).json({
      message: "Registro insertado con éxito!",
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
export default insertRegistroController;
