// Middleware de ruta no encontrada
const notFoundController = (req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not Found",
  });
};

// Exportamos la función
export default notFoundController;
