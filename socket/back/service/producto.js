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
  await insertarMovimiento("salida", qty);
  return result.rows[0];
};

export const entradaStock = async (cantidad) => {
  const qty = Number(cantidad);
  if (isNaN(qty) || qty <= 0) throw new Error("Cantidad inválida");
  const result = await pool.query(
    "UPDATE producto SET stock = stock + $1 WHERE id = 1 RETURNING *",
    [qty]
  );
  await insertarMovimiento("entrada", qty);
  return result.rows[0];
};

export const insertarMovimiento = async (tipo, cantidad) => {
  const qty = Number(cantidad);
  if (isNaN(qty) || qty <= 0) throw new Error("Cantidad inválida");
  const result = await pool.query(
    "INSERT INTO historial (tipo, cantidad, prodId) VALUES ($1, $2, 1) RETURNING *",
    [tipo, qty]
  );
  return result.rows[0];
};

export const getHistorial = async () => {
  const result = await pool.query(
    "SELECT h.*, p.nombre, p.stock, p.codigo FROM historial h inner join producto p on p.id = h.prodId"
  );

  const historial = result.rows;

  let totalEntradas = 0;
  let totalSalidas = 0;

  historial.forEach((movimiento) => {
    if (movimiento.tipo === "entrada") {
      totalEntradas += movimiento.cantidad;
    } else {
      totalSalidas += movimiento.cantidad;
    }
  });

  return {
    historial,
    totalEntradas,
    totalSalidas,
    diferencia: totalEntradas - totalSalidas,
  };
};
