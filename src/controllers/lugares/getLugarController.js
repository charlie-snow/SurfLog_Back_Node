import getLugar from "../../models/lugares/getLugar.js";
import genError from "../../utils/helpers.js";

const getLugarController = async (req, res, next) => {
  try {
    const { id } = req.params;

    let estado = "Correcto";

    const lugar = await getLugar(id);

    console.log(lugar);

    if (!lugar) {
      throw genError("No hay coincidencias en tu búsqueda", 404);
    }

    res.send({
      status: estado,
      data: lugar,
    });
  } catch (error) {
    // En caso de error pasamos el error al middleware de gestión de errores
    next(error);
  }
};

export default getLugarController;
