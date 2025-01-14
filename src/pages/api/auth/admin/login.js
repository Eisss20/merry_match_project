import connectionPool from "@/utils/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.setHeader("Allow", ["POST"]).status(405).end();
  }

  const { username, password } = req.body;

  try {
    const sqlQuery = "SELECT * FROM admins WHERE username = $1";
    const { rows } = await connectionPool.query(sqlQuery, [username]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: { username: "Invalid username or email" },
      });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(400).json({
        message: { password: "Invalid password" },
      });
    }

    // Create Token
    const token = jwt.sign(
      {
        admin_id: user.admin_id,
        username: user.username,
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "60000m",
      },
    );

    // เพิ่มการส่ง role กลับไป
    //return res.status(200).json({ message: "Login successful", role: user.role });

    return res
      .status(200)
      .json({ message: "Login successful", adminToken: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
