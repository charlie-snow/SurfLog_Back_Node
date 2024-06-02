import getRegistro from "../../models/registros/getRegistro.js";
import genError from "../../utils/helpers.js";

const getRegistroController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pruebas = req.query.pruebas;

    let estado = "Correcto";

    const registro = await getRegistro(id, pruebas);

    console.log(registro);

    if (!registro) {
      throw genError("No hay coincidencias en tu búsqueda", 404);
    }

    res.send({
      status: estado,
      data: registro,
    });
  } catch (error) {
    // En caso de error pasamos el error al middleware de gestión de errores
    next(error);
  }
};

export default getRegistroController;
