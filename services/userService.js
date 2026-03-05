import { sql } from '../config.js';

export const createNewUser = async (user) => {
  try {
    const result = await sql`
      INSERT INTO users (email, password)
      VALUES (${user.email}, ${user.password})
      RETURNING *
    `;
    console.log('CREATE USER::', result);
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findUser = async (email) => {
  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findUserByToken = async (token) => {
  try {
    const result = await sql`SELECT * FROM users WHERE token = ${token}`;
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateUser = async (id, token) => {
  try {
    const result =
      await sql`UPDATE users SET token = ${token} WHERE id = ${id} RETURNING id`;
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};
