import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const results = await connectionPool.query(
        "SELECT meeting_interest_id, meeting_name FROM meeting_interest",
      );

      return res.status(200).json(results.rows);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server could not get meeting interest list because database connection",
      });
    }
  }
}
