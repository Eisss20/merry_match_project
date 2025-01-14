import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const userId = req.query.user_id; // รับ user_id จาก Query Params

      if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
      }

      // Query ดึงข้อมูลแพ็กเกจและตรวจสอบสถานะ Active
      const query = `
        SELECT 
          packages.package_id AS id, 
          packages.name_package AS title, 
          packages.price, 
          currency.currency_code,  
          packages.limit_match AS limit, 
          packages.description, 
          packages.icon_url,
          packages.stripe_price_id,
          CASE 
            WHEN EXISTS (
              SELECT 1 
              FROM subscriptions s
              JOIN payment p ON s.payment_id = p.payment_id
              WHERE p.user_id = $1 
                AND s.package_id = packages.package_id 
                AND s.subscription_status = 'Active'
            ) THEN true
            ELSE false
          END AS is_same_package_active
        FROM packages
        JOIN currency ON packages.currency_id = currency.currency_id
        ORDER BY packages.package_id;
      `;

      const result = await connectionPool.query(query, [userId]);

      // แปลง description จาก JSON string ให้เป็น array
      const updatedPackages = result.rows.map((pkg) => ({
        ...pkg,
        details: JSON.parse(pkg.description), // แปลง string เป็น array
      }));

      // ส่งข้อมูลกลับไปยัง FrontEnd
      res.status(200).json(updatedPackages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
