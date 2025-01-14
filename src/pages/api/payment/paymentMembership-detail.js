import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    try {
      const query = `
        SELECT 
    s.subscription_start_date,
    s.subscription_end_date,
    s.subscription_status, 
    p.payment_id, 
    p.user_id, 
    p.package_id, 
    pk.name_package,
    pk.icon_url,
    pk.price,
    pk.description

FROM subscriptions s
JOIN payment p ON s.payment_id = p.payment_id
JOIN packages pk ON p.package_id = pk.package_id
WHERE p.user_id = $1 -- เปลี่ยน $1 เป็นตัวแปร user_id
ORDER BY s.subscription_start_date DESC
LIMIT 1`;

      const values = [user_id];
      const result = await connectionPool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed ` });
  }
}
