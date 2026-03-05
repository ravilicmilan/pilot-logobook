import { sql } from '../config.js';
import { logbookSchema } from '../utils/helpers.js';

export const createNewRow = async (logdata) => {
  try {
    const validatedData = logbookSchema.parse(logdata);

    const keys = Object.keys(validatedData);
    const values = Object.values(validatedData);

    if (keys.length === 0) throw new Error('No data provided');

    const columnNames = keys.join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const result = await sql.query(
      `INSERT INTO logbook (${columnNames}) VALUES (${placeholders}) RETURNING *`,
      values
    );

    return result;
  } catch (err) {
    console.error('ERROR INSERT LOGBOOK', err);
    throw new Error(err.message);
  }
};

export const getAllLogs = async () => {
  try {
    const result = await sql`SELECT * FROM logbook`;
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateLog = async (id, updates) => {
  try {
    const validatedData = logbookSchema.parse(updates);
    const keys = Object.keys(validatedData);

    if (keys.length === 0) throw new Error('No updates provided');

    const setClause = keys.map((key, i) => `"${key}" = $${i + 1}`).join(', ');

    const queryValues = [...Object.values(validatedData), id];

    const result = await sql.query(
      `UPDATE logbook SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      queryValues
    );

    return result;
  } catch (err) {
    console.error('ERROR UPDATE LOGBOOK', err);
    throw err;
  }
};

export const deleteLog = async (id) => {
  try {
    const result = await sql`DELETE FROM logbook WHERE id = ${id}`;
    return { success: true };
  } catch (err) {
    throw new Error(err.message);
  }
};
