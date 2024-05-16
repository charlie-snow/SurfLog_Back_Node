// Importaciones
import getPool from "../../db/getPool.js";
import bcrypt from "bcrypt";
import genError from "../../utils/helpers.js";
import { HOST_DB, PORT } from "../../../env.js";
import { nanoid } from "nanoid";

// Guardamos en una variable el gestor de conexiones a la DB para su uso
const pool = await getPool();

// Función para modificar los datos
const modify = async (req, res, next) => {
  try {
    // Guardamos el id del usuario autenticado con el token en una constante
    const authUserId = req.auth;

    // Guardamos el id del usuario del que quiere modificar los datos
    const modUser = req.params.id;

    // Comprobamos que los 2 ids coinciden, si no es así lanza un error
    if (String(authUserId) !== String(modUser)) {
      throw genError("No tienes permisos para editar este usuario", 403);
    }

    // Guardamos la respuesta del body con los datos que nos interesa poder modificar
    const { name, lastName, email, password } = req.body;

    // Verificamos si hay un archivo para actualizar la foto
    let photoPath = null;
    if (req.files && req.files.photo) {
      const photo = req.files.photo;
      const photoN = photo.name;
      const photoFormat = photoN.split(".");

      const finalFileName =
        nanoid() + "." + photoFormat[photoFormat.length - 1];
      photo.mv(`./uploads/users/${finalFileName}`);
      photoPath = `http://${HOST_DB}:${PORT}/users/${finalFileName}`;
    }

    // Hasheamos la contraseña si se proporciona
    let hashedPass = null;
    if (password) {
      hashedPass = await bcrypt.hash(password, 5);
    }

    // Aquí incluimos la consulta a la base de datos para actualizar los valores, dependiendo de los valores que le pongamos, se añadirá peticiones a la Query
    let updateQuery = "UPDATE users SET";
    const values = [];

    // Nombre
    if (name) {
      updateQuery += " name=?,";
      values.push(name);
    }

    // Apellido
    if (lastName) {
      updateQuery += " lastName=?,";
      values.push(lastName);
    }

    // Email
    if (email) {
      updateQuery += " email=?,";
      values.push(email);
    }

    // Contraseña (Hasheada)
    if (hashedPass) {
      updateQuery += " password=?,";
      values.push(hashedPass);
    }

    // Photo
    if (photoPath) {
      updateQuery += " photo=?,";
      values.push(photoPath);
    }

    // Eliminamos la coma del query de la última actualización que se haga
    updateQuery = updateQuery.slice(0, -1);

    if (!name && !lastName && !email && !password && !req.files.photo) {
      throw genError(
        "Para modificar datos debes insertar al menos un campo",
        400
      );
    }

    // Agregamos la condición WHERE para el usuario específico
    updateQuery += " WHERE id=?";
    values.push(modUser);

    // Ejecutamos la actualización
    await pool.query(updateQuery, values);

    // Respuesta
    res.status(200).json({
      message: "Usuario modificado con éxito!",
    });
  } catch (error) {
    // En caso de error pasamos el error al middleware de gestión de errores
    next(error);
  }
};

// Exportaciones
export default modify;
