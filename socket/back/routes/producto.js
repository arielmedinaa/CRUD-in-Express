import express from "express";
import { getProductsController, updateStockController, entradaStockController } from "../controllers/productoController.js";

const router = express.Router();

router.get("/", getProductsController);
router.post("/salida", updateStockController);
router.post("/entrada", entradaStockController);

export default router;