// Creamos una función para mantener la estructura en todos los errores generados

const genError = (message, status) => {
  const error = new Error(message);
  error.httpStatus = status;

  return error;
};

export default genError;
