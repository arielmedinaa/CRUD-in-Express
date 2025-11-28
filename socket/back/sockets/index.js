import WebSocket from "ws";
import { getHistorial } from "../service/producto.js";

let wssGlobal;

export function socketHandler(wss) {
    wssGlobal = wss;

    wss.on("connection", (ws) => {
        console.log("Cliente WebSocket conectado");

        ws.on("message", (message) => {
            console.log("Mensaje recibido:", message);
        });

        ws.send(JSON.stringify({ msg: "Conexión establecida" }));
    });
}

export async function broadcastStockUpdate(stock) {
    console.log("Broadcasting stock update:", stock);
    if (!wssGlobal) return;

    const historial = await getHistorial();

    console.log("Historial:", historial);

    wssGlobal.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ stock, historial }));
        }
    });
}
