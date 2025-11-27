import pool from "../db/pool.js";
import xlsx from "xlsx";
import { UserModel } from "../model/user.model.js";

export const insertUsers = async (user) => {
  const { rows } = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [user.name, user.email, user.password]
  );

  const row = rows[0];

  return new UserModel(
    row.id,
    row.name,
    row.email,
    row.password
  );
};

export const getAllUsers = async (filters = {}) => {
  const queryParams = [];
  const whereClauses = [];
  let query = 'SELECT * FROM users';

  if (filters.name) {
    queryParams.push(`%${filters.name}%`);
    whereClauses.push(`name ILIKE $${queryParams.length}`);
  }

  if (filters.email) {
    queryParams.push(`%${filters.email}%`);
    whereClauses.push(`email ILIKE $${queryParams.length}`);
  }

  if (whereClauses.length > 0) {
    query += ' WHERE ' + whereClauses.join(' AND ');
  }

  query += ' ORDER BY id ASC';

  const limit = filters.limit || 10;
  const offset = filters.offset || 0;
  query += ` LIMIT ${limit} OFFSET ${offset}`;

  const { rows } = await pool.query(query, queryParams);
  
  return rows.map(row => new UserModel(
    row.id,
    row.name,
    row.email,
    row.password
  ));
};

export const deleteUser = async (idUser) => {
  await pool.query('DELETE FROM users WHERE id = $1', [idUser]);
  return "User deleted successfully";
}

export const importUserExcel = async (file) => {
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(worksheet);
    const users = data.map(
        (u) => new UserModel(null, u.name, u.email, u.password)
    );

    const insertedUsers = [];

    for (const user of users) {
        const { rows } = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [user.name, user.email, user.password]
        );

        const row = rows[0];

        insertedUsers.push(
            new UserModel(row.id, row.name, row.email, row.password)
        );
    }

    return insertedUsers;
};

