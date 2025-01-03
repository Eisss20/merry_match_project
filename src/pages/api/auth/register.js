import multer from "multer";
import connectionPool from "@/utils/db.js";
import { cloudinaryUpload } from "../../../utils/upload.js";
import bcrypt from "bcrypt";

const multerUpload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.setHeader("Allow", ["POST"]).status(405).end();
  }

  multerUpload.fields([{ name: "avatar", maxCount: 5 }])(
    req,
    res,
    async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res
          .status(500)
          .json({ message: "File upload failed", error: err.message });
      }

      const gender_id = parseInt(req.body.sexualIdentities, 10);
      const sexual_Preference_id = parseInt(req.body.sexualPreferences, 10);
      const racial_Preference_id = parseInt(req.body.racialPreferences, 10); // แก้ไขจาก sexualPreferences
      const meeting_Interest_id = parseInt(req.body.meetingInterests, 10);
      const racial_identity_id = parseInt(req.body.racialIdentities, 10);
      const hobbies = req.body.hobbies;
      const location_id = parseInt(req.body.selectedLocation, 10);
      const city_id = parseInt(req.body.citys, 10);

      if (typeof hobbies === "string") {
        try {
          const parsedHobbies = JSON.parse(hobbies);
          if (Array.isArray(parsedHobbies)) {
            const hobbies_id = parsedHobbies.map((hobby) =>
              parseInt(hobby.value, 10),
            );

            try {
              const user = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                date: req.body.date,
                location_id: location_id,
                city_id: city_id,
                sexual_Preference_id: sexual_Preference_id,
                racial_Preference_id: racial_Preference_id,
                meeting_Interest_id: meeting_Interest_id,
                hobbies_id: hobbies_id,
                image_profile: req.body.avatar,
                gender_id: gender_id,
                about_me: req.body.aboutme,
                racial_identity_id: racial_identity_id,
              };

              const birthYear = new Date(req.body.date).getFullYear();
              const currentYear = new Date().getFullYear();
              let age = currentYear - birthYear;

              if (!user.password) {
                return res
                  .status(400)
                  .json({ message: "Password is required" });
              }

              const sqlQuery = `
                SELECT username, email 
                FROM users 
                WHERE username = $1 OR email = $2
              `;
              const { rows } = await connectionPool.query(sqlQuery, [
                user.username,
                user.email,
              ]);

              if (rows.length > 0) {
                const duplicateFields = [];
                rows.forEach((row) => {
                  if (row.username === user.username)
                    duplicateFields.push("username");
                  if (row.email === user.email) duplicateFields.push("email");
                });

                return res.status(400).json({
                  message: `Duplicate fields: ${duplicateFields.join(", ")}`,
                  duplicateFields,
                });
              }

              const salt = await bcrypt.genSalt(10);

              user.password = await bcrypt.hash(user.password, salt);

              const image_profile = [];
              if (req.files?.avatar) {
                for (let file of req.files.avatar) {
                  try {
                    const uploadedFile = await cloudinaryUpload(
                      file.buffer,
                      file.originalname,
                    );
                    image_profile.push(uploadedFile.url);
                  } catch (error) {
                    console.error("Cloudinary upload error:", error.message);
                    return res.status(500).json({
                      message: "File upload failed",
                      error: error.message,
                    });
                  }
                }
              }

              const insertQuery = `
          INSERT INTO users (
            username, email, password
          )
          VALUES ($1, $2, $3)
          RETURNING *`;

              const result = await connectionPool.query(insertQuery, [
                user.username,
                user.email,
                user.password,
              ]);

              const userId = result.rows[0].user_id;
              const insertQueryProfiles = `
          INSERT INTO user_profiles ( user_id,name,date_of_birth,age,location_id,city_id,gender_id,sexual_Preference_id,racial_Preference_id,meeting_Interest_id,hobbies_id,about_me,image_profile,racial_identity_id)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`;

              await connectionPool.query(insertQueryProfiles, [
                userId,
                user.name,
                user.date,
                age,
                user.location_id,
                user.city_id,
                user.gender_id,
                user.sexual_Preference_id,
                user.racial_Preference_id,
                user.meeting_Interest_id,
                user.hobbies_id,
                user.about_me,
                image_profile,
                user.racial_identity_id,
              ]);

              return res.status(201).json({
                message: "Registration successful",
                user: result.rows[0],
              });
            } catch (error) {
              console.log(error);
              return res.status(500).json({
                message: "Internal Server Error",
                error: error.message,
              });
            }
          } else {
            return res.status(400).json({ message: "Invalid hobbies data" });
          }
        } catch (error) {
          console.error("Error parsing hobbies string:", error);
          return res
            .status(400)
            .json({ message: "Invalid JSON format for hobbies" });
        }
      } else {
        return res.status(400).json({ message: "Hobbies should be a string" });
      }
    },
  );
}
