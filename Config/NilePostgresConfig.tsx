 import {Client} from 'node-postgres'
  
 export const client = new Client({
   user: process.env.PUBLIC_NILE_USERNAME ,
  password: process.env.PUBLIC_NILE_PASSWORD,
  host: "us-west-2.db.thenile.dev",
  port: 5432,
 database: "UniVibe",
  });