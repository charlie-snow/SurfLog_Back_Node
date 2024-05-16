// Middleware de errores
const errorController = (err, req, res, next) => {
  const statusCode = err.httpStatus || 500;
  console.log(err);
  res.status(statusCode).send({
    status: err.code,
    message: err.message,
  });
};
// Exportamos el middleware
export default errorController;
