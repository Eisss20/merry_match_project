import connectionPool from "@/utils/db.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username } = req.body;
    const sqlQuery = `SELECT username FROM users WHERE username = $1`;
    const { rows } = await connectionPool.query(sqlQuery, [username]);

   
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].username === username) {
        return res.status(200).json({ exists: true }); 
      }
    }
    return res.status(200).json({ exists: false });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
