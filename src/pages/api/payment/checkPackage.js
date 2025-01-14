import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user_id, package_id } = req.body;

    // ตรวจสอบว่าได้รับ user_id และ package_id ครบถ้วน
    if (!user_id || !package_id) {
      return res
        .status(400)
        .json({ error: "User ID and Package ID are required." });
    }

    try {
      const checkAnySubscriptionQuery = `
              SELECT s.subscription_status 
              FROM subscriptions s
              JOIN payment p ON s.payment_id = p.payment_id
              WHERE p.user_id = $1 
              AND s.subscription_status = 'Active'
              `;
      const anySubscriptionResult = await connectionPool.query(
        checkAnySubscriptionQuery,
        [user_id],
      );

      if (anySubscriptionResult.rowCount > 0) {
        // หากมี active package อื่น -> อนุญาตให้ซื้อ (แสดง modal)
        return res.status(200).json({
          message: "You can purchase this package.",
          isActive: true, // มี active package
          isSamePackageActive: false,
        });
      } else {
        // หากไม่มี Subscription ใดเลย -> อนุญาตให้ซื้อโดยไม่มี modal
        return res.status(200).json({
          message: "You can purchase this package.",
          isActive: false, // ไม่มี active package
          isSamePackageActive: false,
        });
      }
    } catch (error) {
      console.error("Error checking package status:", error);
      return res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
