import connectionPool from "@/utils/db";
import { protectUser } from "@/middleware/protectUser";

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await runMiddleware(req, res, protectUser);

      const { id: userId } = req.query;

      const query = `
        SELECT
          matches_remaining,
          total_limit,
          subscription_id
        FROM user_match_subscription
        WHERE user_match_subscription.user_id = $1
      `;

      const result = await connectionPool.query(query, [userId]);

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching user match subscription:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }
}
