import { getProducts, salidaStock, entradaStock, getHistorial } from "../service/producto.js";
import { broadcastStockUpdate } from "../sockets/index.js";

export const getProductsController = async (req, res) => {
    const products = await getProducts();
    res.json(products);
};

export const updateStockController = async (req, res) => {
    const { stock } = req.body;
    const updatedProduct = await salidaStock(stock);

    console.log("Producto actualizado:", updatedProduct);
    broadcastStockUpdate(updatedProduct.stock);
    res.json({ producto: updatedProduct, message: "Stock actualizado" });
};

export const entradaStockController = async (req, res) => {
    const { stock } = req.body;
    const updatedProduct = await entradaStock(stock);

    console.log("Producto actualizado:", updatedProduct);
    broadcastStockUpdate(updatedProduct.stock);
    res.json({ producto: updatedProduct, message: "Stock actualizado" });
};

export const getHistorialController = async (req, res) => {
    const historial = await getHistorial();
    res.json(historial);
};
