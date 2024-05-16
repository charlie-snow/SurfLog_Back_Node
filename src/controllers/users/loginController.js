// Importaciones
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import getPool from "../../db/getPool.js";
import { TOKEN_SECRET } from "../../../env.js";
import genError from "../../utils/helpers.js";

// Definimos el gestor de conexiones a la DB
const pool = await getPool();

// Creamos la función para logear un usuario, obteniendo así un token que usaremos para funciones que requieran autentificación
const login = async (req, res, next) => {
  try {
    // Obtenemos email y contraseña de la petición
    const { email, password } = req.body;
    // Buscamos en la DB un usuario que coincida con el parámetro anteriormente obtenido (email)
    const [result] = await pool.query(`SELECT * FROM users WHERE email=?`, [
      email,
    ]);

    // Guardamos el usuario en una variable para su uso
    const userFound = result[0];

    // En caso de no existir ese usuario, generar un error con mensaje
    if (!userFound) {
      throw genError("Email o contraseña incorrectas", 401);
    }
    // De existir el usuario, comparar la contraseña de la DB con la obtenida por parámetro en la función
    const passwordMatch = await bcrypt.compare(password, result[0].password);

    // En caso de no coincidir la contraseña, generar un error con mensaje
    if (!passwordMatch) {
      throw genError("Email o contraseña incorrectas", 401);
    }

    // Habiendo coincidido la contraseña en el anterior punto, firmamos el token que identificará al usuario para realizar otro tipo de peticiones que dependan de autorización
    const token = jwt.sign(
      {
        id: userFound.id,
        name: userFound.name,
      },
      TOKEN_SECRET,
      {
        expiresIn: "2d",
      }
    );

    // Respuesta
    res.status(200).json({
      status: "Correcto",
      message: "Bienvenid@",
      token,
      id:userFound.id,
      name: userFound.name,
      lastName: userFound.lastName,
      photoPath: userFound.photo,
    });
  } catch (error) {
    // En caso de error pasamos el error al middleware de gestión de errores
    next(error);
  }
};

// Exportamos la función
export default login;
