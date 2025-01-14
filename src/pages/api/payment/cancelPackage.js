import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      // ตรวจสอบว่ามี Subscription ที่ Active หรือไม่
      const checkQuery = `
        SELECT s.subscription_id
        FROM subscriptions s
        JOIN payment p ON s.payment_id = p.payment_id
        WHERE p.user_id = $1 AND s.subscription_status = 'Active'
        LIMIT 1;
      `;
      const checkResult = await connectionPool.query(checkQuery, [user_id]);

      if (checkResult.rowCount === 0) {
        return res
          .status(404)
          .json({ error: "No active subscription found for this user" });
      }

      // ยกเลิก Subscription
      const cancelQuery = `
        UPDATE subscriptions
        SET subscription_status = 'Cancelled'
        WHERE subscription_id = $1;
      `;
      await connectionPool.query(cancelQuery, [
        checkResult.rows[0].subscription_id,
      ]);

      return res
        .status(200)
        .json({ message: "Subscription cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
