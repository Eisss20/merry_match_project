import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const results = await connectionPool.query(
        "SELECT racial_id, racial_name FROM racial_identity",
      );

      return res.status(200).json(results.rows);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server could not get racial list because database connection",
      });
    }
  }
}
