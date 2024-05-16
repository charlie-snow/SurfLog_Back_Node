import getLugar from "../../models/lugares/getLugar.js";
import genError from "../../utils/helpers.js";
import getMDatosLugar from "./getMDatosLugar.js";

const getLugarMdatosController = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { momento } = req.body;

    let estado = "Correcto";
    let errores = "";

    const lugar = await getLugar(id);

    console.log(lugar);
    if (!lugar) {
      throw genError("No hay coincidencias en tu búsqueda", 404);
    } else {
      if (momento) {
        try {
          lugar.mdatos = await getMDatosLugar(lugar, momento);
          errores = "Lugar y mdatos sin errores";
        } catch (error) {
          errores = "Error obteniendo mdatos: " + error;
        }
        lugar.momento = momento;
      }
    }

    res.send({
      status: estado,
      error: errores,
      data: lugar,
    });
  } catch (error) {
    // En caso de error pasamos el error al middleware de gestión de errores
    next(error);
  }
};

export default getLugarMdatosController;
