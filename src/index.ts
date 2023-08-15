import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Client } from 'ts-postgres';

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

const app = express();
const port = process.env.PORT || '3000';


app.get('/', async (req: Request, res: Response) => {
  await client.connect();
  const result = await client.query('SELECT $1::text as message', ['Hello world!']);
  console.log('conecto');
  console.log(result.rows[0]);
  await client.end();
  res.status(200).send('👉👉👉👉 Endpoint working');
});

app.listen(port, () => {
  console.log(`👨‍💻 Server is working! Port: ${port}`);
});
