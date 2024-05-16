import jwt from "jsonwebtoken";
import genError from "../utils/helpers.js";
import { TOKEN_SECRET } from "../../env.js";

// Creamos una función para verificar la autentificación del usuario
const Auth = (req, res, next) => {
  try {
    console.log("Auth middleware alcanzado");
    // Requerimos la autorización del que envía la peticióm (token)
    const { authorization } = req.headers;

    // Comprobamos si tiene o no autorización
    if (!authorization) {
      throw genError("El header 'authorization' es requerido", 401);
    }

    // Separamos el tipo de token y el código de token
    const [tokenType, token] = authorization.split(" ");

    // Comprobamos el tipo del token
    if (tokenType !== "Bearer") {
      throw genError("El token debe ser de tipo 'Bearer'", 400);
    }

    let tokenPayload;

    // Verificamos si el token fue creado con TOKEN_SECRET de nuestro archivo .env, de no haberlo hecho tira un error
    try {
      tokenPayload = jwt.verify(token, TOKEN_SECRET);
    } catch (error) {
      throw genError("El token es inválido", 400);
    }

    req.auth = tokenPayload.id;

    next();
  } catch (error) {
    next(error);
  }
};

export default Auth;
