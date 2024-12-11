import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const query = `select * from user_profiles where user_id = $1`;
      const { rows } = await connectionPool.query(query, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to fetch user data" });
    }
  }
}
