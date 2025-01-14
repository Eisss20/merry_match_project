import connectionPool from "@/utils/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.setHeader("Allow", ["POST"]).status(405).end();
  }

  const { username, password } = req.body;

  try {
    const passwordQuery =
      "SELECT user_id, password FROM users WHERE username = $1 OR email = $1";
    const passwordResult = await connectionPool.query(passwordQuery, [
      username,
    ]);

    // Check username
    if (passwordResult.rows.length === 0) {
      return res.status(400).json({
        message: { username: "Invalid username or email" },
      });
    }

    const { user_id, password: hashedPassword } = passwordResult.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      return res.status(400).json({
        message: { password: "Invalid password" },
      });
    }

    const userProfileQuery = `
      SELECT
        user_profiles.user_id,
        user_Profiles.name,
        user_Profiles.age,
        gender.gender_name AS sexual_preference,
        user_Profiles.image_profile
      FROM user_profiles
      LEFT JOIN Gender
      ON user_Profiles.sexual_preference_id = gender.gender_id
      WHERE user_profiles.user_id = $1
    `;

    const userProfileResult = await connectionPool.query(userProfileQuery, [
      user_id,
    ]);

    const {
      user_id: id,
      name,
      sexual_preference,
      image_profile,
    } = userProfileResult.rows[0];

    const token = jwt.sign(
      {
        id,
        name,
        sexual_preference: sexual_preference || null,
        image_profile: image_profile || null,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" },
    );

    return res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}
