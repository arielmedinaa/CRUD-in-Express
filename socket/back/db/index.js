import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
    host: process.env.PG_HOST_SOCKET,
    port: process.env.PG_PORT_SOCKET,
    user: process.env.PG_USER_SOCKET,
    password: process.env.PG_PASSWORD_SOCKET,
    database: process.env.PG_DATABASE_SOCKET,
});

pool.connect((err, client, release) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err);
        return;
    }
    console.log("Conectado a la base de datos");
    release();
});

export default pool;