import { Pool } from "pg";
const connectionPool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});
export default connectionPool;
