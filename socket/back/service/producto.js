import pool from "../db/index.js";

export const getProducts = async () => {
    const result = await pool.query("SELECT * FROM producto");
    return result.rows[0];
};

export const salidaStock = async (cantidad) => {
    const qty = Number(cantidad);
    if (isNaN(qty) || qty <= 0) throw new Error("Cantidad inválida");

    const result = await pool.query(
        "UPDATE producto SET stock = stock - $1 WHERE id = 1 RETURNING *",
        [qty]
    );

    return result.rows[0];
};

export const entradaStock = async (cantidad) => {
    const qty = Number(cantidad);
    if (isNaN(qty) || qty <= 0) throw new Error("Cantidad inválida");

    const result = await pool.query(
        "UPDATE producto SET stock = stock + $1 WHERE id = 1 RETURNING *",
        [qty]
    );

    return result.rows[0];
};
