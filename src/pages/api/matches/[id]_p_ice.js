import jwt from "jsonwebtoken";
import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // *** ดึง JWT Token จาก Headers ***
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      let user_master; // ตัวแปรที่จะเก็บ user_master

      // *** ตรวจสอบและ decode Token ***
      try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // ตรวจสอบความถูกต้องของ Token
        console.log("Decoded Token:", decodedToken);
        user_master = decodedToken.id; // ดึง ID ผู้ใช้จาก payload ของ Token
      } catch (err) {
        console.error("Invalid token:", err.message);
        return res.status(401).json({ error: "Invalid token" }); // ส่งข้อความแจ้งเตือนหาก token ไม่ถูกต้อง
      }

      // ดึง user_second จาก Body
      const { user_second } = req.body;

      // ตรวจสอบว่า user_master และ user_second มีค่าหรือไม่
      if (!user_master || !user_second) {
        return res.status(400).json({
          error: "Both user_master (from token) and user_second are required.",
        });
      }

      if (user_master === user_second) {
        return res
          .status(400)
          .json({ error: "You cannot match with yourself." });
      }

      // ตรวจสอบข้อมูลในฐานข้อมูล
      const checkQuery = `
        SELECT user_master, user_second FROM Matching 
        WHERE user_master = $1 AND user_second = $2;
      `;
      const checkResult = await connectionPool.query(checkQuery, [
        user_master,
        user_second,
      ]);

      if (checkResult.rows.length > 0) {
        return res.status(409).json({
          error: "This match already exists.",
          data: checkResult.rows[0],
        });
      }

      // Insert ข้อมูลใหม่
      const insertQuery = `
        INSERT INTO Matching (user_master, user_second)
        VALUES ($1, $2)
        RETURNING user_master, user_second;
      `;
      const insertResult = await connectionPool.query(insertQuery, [
        user_master,
        user_second,
      ]);

      res.status(201).json({
        message: "Match successfully created.",
        data: insertResult.rows[0],
      });
    } catch (error) {
      console.error("Error processing match:", error);
      res.status(500).json({ error: "Failed to create match." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed.` });
  }
}
