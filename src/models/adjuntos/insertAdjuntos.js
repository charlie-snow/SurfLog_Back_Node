import { insertAdjunto } from "./index.js";

const insertAdjuntos = async (adjuntos, registro_id, pruebas, tipo) => {
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

export default insertAdjuntos;
