import http from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { WebSocketServer } from "ws";
import { socketHandler } from "./sockets/index.js";
import productoRoutes from "./routes/producto.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'User-Agent', 'Referer'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
app.use(express.json());
app.use("/productos", productoRoutes);
socketHandler(wss);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
