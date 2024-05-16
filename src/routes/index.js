import express from "express";
import registrosRouter from "./registrosRouter.js";
import lugaresRouter from "./lugaresRouter.js";

// Creamos el enrutador
const router = express.Router();

// Creamos las rutas
router.use(registrosRouter);
router.use(lugaresRouter);
export default router;
