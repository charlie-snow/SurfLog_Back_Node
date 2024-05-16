// Importaciones
import bcrypt from "bcrypt";
import sendMailUtil from "../../utils/sendMail.js";
import { insertUser, emailExist } from "../../models/users/registerUser.js";
import { nanoid } from "nanoid";
import { HOST_DB, PORT } from "../../../env.js";

// Creamos una función para manejar el registro de un usuario
const register = async (req, res, next) => {
  try {
    // Obtenemos los parámetros necesarios para el registro del body de la petición
    const { name, lastName, email, password } = req.body;

    // Verificar si se cargó un archivo
    let photoPath = null;
    if (req.files && req.files.photo) {
      // Obtener el archivo de la solicitud
      const photo = req.files.photo;
      const photoN = photo.name;

      const photoFormat = photoN.split(".");

      // Guardar la imagen en la carpeta "uploads"
      const nombreArchivoFinal =
        nanoid() + "." + photoFormat[photoFormat.length - 1];
      photo.mv(`./uploads/users/${nombreArchivoFinal}`);

      // Establecer la ruta de la foto en caso de que se haya subido
      photoPath = `http://${HOST_DB}:${PORT}/users/${nombreArchivoFinal}`;
    } else {
      // Si no se cargó el archivo, se le asigna un icono por defecto
      photoPath = `http://${HOST_DB}:${PORT}/UserIcon.png`;
    }
    // Verificar si el email ya está en uso
    await emailExist(email);

    // Hashear la contraseña
    const hashedPass = await bcrypt.hash(password, 5);

    // Insertar el nuevo usuario en la base de datos con la ruta de la imagen de perfil
    await insertUser({ name, lastName, email, hashedPass, photoPath });

    // Nodemailer para los que se registran
    const emailSubject = "Cuenta registrada";
    const emailBody = `<h1> ¡Bienvenid@ ${name}! 😄 Esperamos que encuentres lo que buscas y tengas una registro positiva 😎`;

    // Enviar el correo electrónico
    await sendMailUtil(email, emailSubject, emailBody);

    // Respuesta
    res.status(200).json({
      message: "Usuario creado con éxito!",
    });
  } catch (error) {
    // En caso de error pasamos el error al middleware de gestión de errores
    next(error);
  }
};

// Exportaciones
export default register;
