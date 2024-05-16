import express from "express";
import serverless from "serverless-http";
import { PORT, HOST_DB } from "./env.js";
import morgan from "morgan";
import cors from "cors";
import {
  notFoundController,
  errorController,
} from "./src/controllers/errors/index.js";
import router from "./src/routes/index.js";
import fileUpload from "express-fileupload";

// Usamos express
const app = express();

// Hacemos que express interprete los JSON
app.use(express.json());

// Usamos express.static para convertir en pública la carpeta "uploads"
// app.use(express.static("uploads"));
// app.use(express.static(path.join(__dirname, "uploads")));

// Usamos express-fileupload para subir archivos
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// Usamos morgan para recibir en consola las peticiones hechas
app.use(morgan("dev"));

// Usamos CORS para proteger las peticiones al servicio solamente con los http permitidos
// const allowedHttp = [
//   "http://localhost:3000",
//   "http://localhost:3001",
//   "http://localhost:5173",
// ];

// app.use(cors({ origin: allowedHttp }));

app.use(cors());
// app.use(cors({ origin: true }));

//Middleware llamando a las rutas
app.use(router);

// Gestión de error 404: Not Found
app.use(notFoundController);

// Uso del middleware de errores
app.use(errorController);

// app.get("/", (req, res) => {
//   res.send("Express on Vercel");
// });

// Levantamos el servicio
app.listen(PORT, () => {
  console.log(`Servidor escuchando en :${PORT}`);
});

// module.exports = app; // Export the Express app
export default app;
