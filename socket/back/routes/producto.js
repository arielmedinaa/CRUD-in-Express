import express from "express";
import { getProductsController, updateStockController, entradaStockController, getHistorialController } from "../controllers/productoController.js";

const router = express.Router();

router.get("/", getProductsController);
router.post("/salida", updateStockController);
router.post("/entrada", entradaStockController);
router.get("/historial", getHistorialController);

export default router;