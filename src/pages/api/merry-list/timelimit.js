import connectionPool from "@/utils/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1]; // ตรวจสอบ Token จาก Header
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  try {
    // ถอดรหัส Token และดึง user_id
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const user_id = decodedToken.id;

    if (req.method === "GET") {
      const limitQuery = `
        SELECT 
          user_id, 
          reset_time, 
          hours_reset_time, 
          matches_remaining, 
          total_limit 
        FROM 
          user_match_subscription
        WHERE 
          user_id = $1;
      `;

      // Query ข้อมูลโดยใช้ user_id
      const result = await connectionPool.query(limitQuery, [user_id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // ส่งข้อมูลกลับให้ Front-End
      return res.status(200).json({
        message: "Success",
        data: result.rows[0],
      });
    } else {
      // ถ้า Method ไม่ใช่ GET
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
