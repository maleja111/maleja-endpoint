import { Client } from 'ts-postgres';
import dotenv from 'dotenv';
import { User } from '../../lib/interfaces/user';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const pgUrl = new URL(DATABASE_URL as string);
const client = new Client({
  user: pgUrl.username,
  host: pgUrl.host,
  database: pgUrl.pathname.replace('/', ''),
  password: pgUrl.password,
  port: 5432,
  keepAlive: true
});

export class DB {

    async createTable(): Promise<any> {
      await client.connect();
      const checkTable = await client.query(`SELECT EXISTS (
        SELECT 1
        FROM   information_schema.tables
        WHERE    table_name = 'users'
        );`);
      if (!checkTable.rows[0][0]) {
          await client.query(`CREATE TABLE users (
            ID SERIAL PRIMARY KEY,
            name VARCHAR(30),
            email VARCHAR(30),
            city VARCHAR(30),
            web VARCHAR(30)
          );`);
      }
      await client.end();
      return checkTable;
    }

    async addNewUser(data:User): Promise<any> {
        const { name, email, city, web }= data;
        await client.connect();
        try {
            const result = await client.query(
                'INSERT INTO users (name, email, city, web) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, email, city, web]
            );
            for await (const row of result) {
              return result;
            }
        } finally {
            console.log('FINAL!!! addNewUser');
            await client.end();
        }
    };

    async getAll(): Promise<any> {
      await client.connect();
      try {
          const result = await client.query('SELECT * FROM users ORDER BY id ASC');
          // for await (const row of result) {
            return result;
          // }
      } finally {
          console.log('FINAL!!! getAll');
          await client.end();
      }
    }

    async getApplicantById(id: number): Promise<any> {
      await client.connect();
      try {
        const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);

          for await (const row of result) {
            return result;
          }
      } finally {
          console.log('FINAL!!! getApplicant');
          await client.end();
      }
    }

    async deleteByID(id: number): Promise<any> {
      await client.connect();
      try {
        const result = await client.query('DELETE FROM users WHERE id = $1', [id]);

          for await (const row of result) {
            return result;
          }
      } finally {
          console.log('FINAL!!! deleteByID');
          await client.end();
      }
    }
}
