// Importaciones
import getPool from "../../db/getPool.js";
import genError from "../../utils/helpers.js";

// Definimos el gestor de conexiones a la DB
const pool = await getPool();

// Creamos una función para borrar tu usuario, siendo previamente autorizado por el middleware de autorización
const deleteUserController = async (req, res, next) => {
  try {
    // Obtenemos el id parámetro de la petición
    const { id } = req.params;
    // Obtenemos el usuario que tenga esa id
    const [[user]] = await pool.query(
      `
    SELECT * FROM users WHERE id = ?
    `,
      [id]
    );

    // Comprobamos si el usuario autorizado y el que se va a borrar son los mismos, ya que solo puedes borrarlo si es TU perfíl
    if (!user) {
      throw genError(
        "No puedes borrar el perfíl de otro usuario o no existe",
        401
      );
    }

    if (req.auth !== user.id) {
      throw genError("No puedes borrar el perfíl de otro usuario", 401);
    }

    // Si la comprobación anterior es correcta, procedemos a borrar el usuario, borrando antes todo su contenido

    await pool.query(
      `
    DELETE FROM users WHERE id = ?
    `,
      [id]
    );

    // Respuesta
    res.send({
      status: "Correcto",
      message: `Usuario con id ${id} borrado con éxito!`,
    });
  } catch (error) {
    // En caso de error pasamos el error al middleware de gestión de errores
    next(error);
  }
};

// Exportamos la función
export default deleteUserController;
