import pg from 'pg';
import dotenv from 'dotenv';
import { User } from '../../lib/interfaces/user';

dotenv.config();
const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
const pgUrl = new URL(DATABASE_URL as string);
const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false}});

export class DB {

    async addNewUser(data:User): Promise<any> {
        const { name, email, city, web } = data;
        const client = await pool.connect();
        try {
            const result = await client.query(
                'INSERT INTO users (name, email, city, web) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, email, city, web]
            );
            if (result.rowCount === 0) {
              throw new Error('An error has occurred while executing the query for getAll endpoint');
            }
            return result;
          } catch(err) {
            throw err;
        } finally {
            client.release();
        }
    };

    async getAll(): Promise<any> {
      const client = await pool.connect();
      try {
          const result = await client.query('SELECT * FROM users ORDER BY id ASC');
          if (result.rowCount === 0) {
            throw new Error('An error has occurred while executing the query for getAll endpoint');
          } 
          return result;
        } catch(err) {
          throw err;
      } finally {
          client.release();
      }
    }

    async getApplicantById(id: number): Promise<any> {
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rowCount === 0) {
          throw new Error(`The user with ID ${id} does not exist`);
        } 
        return result;
      } catch(err) {
          throw err;
      } finally {
          client.release();
      }
    }

    async deleteByID(id: number): Promise<any> {
      const client = await pool.connect();
      try {
        const result = await client.query('DELETE FROM users WHERE id = $1', [id]);
        if (result.rowCount === 0) {
          throw new Error(`Error, we could not delete the userID: ${id}`);
        } 
        return result;
      } catch(err) {
          throw err;
      } finally {
          client.release();
      }
    }

    async updateById(id: number, data:User): Promise<any> {
        const { name, email, city, web } = data;
        const client = await pool.connect();
        try {
            const result = await client.query(
                'UPDATE users SET name = $1, email = $2, city = $3, web = $4 WHERE id = $5',
                [name, email, city, web, id]
            );
            if (result.rowCount === 0) {
              throw new Error('An error has occurred while executing the query for updateById endpoint');
            }
            return result;
          } catch(err) {
            throw err;
        } finally {
            client.release();
        }
    };
}
