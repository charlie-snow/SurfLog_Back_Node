import express from "express";
import lugaresController from "../controllers/lugares/lugaresController.js";
import inicioController from "../controllers/inicioController.js";
import getLugarController from "../controllers/lugares/getLugarController.js";
import getLugarMdatosController from "../controllers/lugares/getLugarMdatosController.js";

const router = express.Router();

router.get("/lugares", lugaresController);

router.get("/lugar/:id", getLugarController);

router.post("/lugar/mdatos/:id", getLugarMdatosController);

router.get("/", inicioController);

export default router;
