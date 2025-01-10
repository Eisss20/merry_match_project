import connectionPool from "@/utils/db.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;
    const sqlQuery = `SELECT email FROM users WHERE email = $1`;
    const { rows } = await connectionPool.query(sqlQuery, [email]);

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].email === email) {
        return res.status(200).json({ exists: true }); 
      }
    }
    return res.status(200).json({ exists: false });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
