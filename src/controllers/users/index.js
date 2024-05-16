// Importamos los distintos tipos de funciones y las exportamos desde un mismo archivo
import registerController from "./registerController.js";
import loginController from "./loginController.js";
import deleteUserController from "./deleteUserController.js";
import modifyController from "./modifyController.js";

// Exportaciones
export {
  registerController,
  loginController,
  deleteUserController,
  modifyController,
};
