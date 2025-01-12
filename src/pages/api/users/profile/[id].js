import multer from "multer";
import connectionPool from "@/utils/db";
import { cloudinaryUpload } from "../../../../utils/upload";

// const multerUpload = multer({ storage: multer.memoryStorage() });
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

const multerUpload = multer({ storage: multer.memoryStorage() });
// const storage = multer.memoryStorage();
// const multerUpload = multer({ storage }).fields([
//   { name: "avatar", maxCount: 1 },
//   { name: "name", maxCount: 1 },
//   { name: "date_of_birth", maxCount: 1 },
//   { name: "city_id", maxCount: 1 },
//   { name: "location_id", maxCount: 1 },
//   { name: "gender_id", maxCount: 1 },
//   { name: "sexual_preference_id", maxCount: 1 },
//   { name: "racial_preference_id", maxCount: 1 },
//   { name: "meeting_interest_id", maxCount: 1 },
//   { name: "hobbies", maxCount: 1 },
//   { name: "about_me", maxCount: 1 },
// ]);
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const userProfileQuery = `
      SELECT 
    user_profiles.user_id,
    user_profiles.date_of_birth, 
    user_profiles.name,
    user_profiles.age,  
    (SELECT ARRAY_AGG(hobbies_profiles.hobbies_id ORDER BY hobbies_profiles.hobbies_id)
     FROM hobbies_profiles
     WHERE hobbies_profiles.profile_id = user_profiles.profile_id) AS hobbies_id,
    (SELECT ARRAY_AGG(hobbies.hobby_name ORDER BY hobbies_profiles.hobbies_id)
     FROM hobbies_profiles
     JOIN hobbies ON hobbies_profiles.hobbies_id = hobbies.hobbies_id
     WHERE hobbies_profiles.profile_id = user_profiles.profile_id) AS hobbies,  
    city.city_name AS city, 
    location.location_name AS location, 
    us.username AS username,    
    us.email AS email,
    g1.gender_name AS gender,
    g2.gender_name AS sexual_preference,
    racial_identity.racial_name AS racial_preference,
    meeting_interest.meeting_name AS meeting_interest,
    user_profiles.about_me,
    COALESCE(
        (
            SELECT JSON_AGG(
                json_build_object(
                    'image_url', img
                )
            )
            FROM unnest(user_profiles.image_profile) AS img
        ),
        '[]'
    ) AS image_profiles
FROM 
    user_profiles
LEFT JOIN users AS us 
    ON user_profiles.user_id = us.user_id
LEFT JOIN city 
    ON user_profiles.city_id = city.city_id
LEFT JOIN location 
    ON user_profiles.location_id = location.location_id
LEFT JOIN gender AS g1
    ON user_profiles.gender_id = g1.gender_id
LEFT JOIN gender AS g2
    ON user_profiles.sexual_preference_id = g2.gender_id
LEFT JOIN racial_identity
    ON user_profiles.racial_preference_id = racial_identity.racial_id
LEFT JOIN meeting_interest
    ON user_profiles.meeting_interest_id = meeting_interest.meeting_interest_id
WHERE 
    user_profiles.user_id = $1
GROUP BY
    user_profiles.profile_id,
    user_profiles.user_id,
    user_profiles.date_of_birth,
    user_profiles.name,
    user_profiles.age,
    city.city_name,
    location.location_name,
    us.username,
    us.email,
    g1.gender_name,
    g2.gender_name,
    racial_identity.racial_name,
    meeting_interest.meeting_name,
    user_profiles.about_me
      `;

      const { rows } = await connectionPool.query(userProfileQuery, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to fetch user data" });
    }
  } else if (req.method === "PUT") {
    // -------------- ชุดนี้ใช้กับรูปภาพ------------- //
    multerUpload.fields([{ name: "filesToUpload", maxCount: 5 }])(
      req,
      res,
      async (err) => {
        if (err) {
          console.error("File upload error:", err);
          return res.status(500).json({ error: "File upload failed" });
        }
        // -------------- ชุดนี้ใช้กับรูปภาพ------------- //

        const {
          name,
          date_of_birth,
          city,
          location,
          gender,
          sexual_preference,
          racial_preference,
          meeting_interest,
          about_me,
        } = req.body;

        // แปลงจาก JSON string เป็น array
        const hobbies = JSON.parse(req.body.hobbies);

        // แปลง hobbies ก่อนส่งไปฐานข้อมูล
        const hobbyIds = hobbies.map((hobby) => parseInt(hobby.value, 10)); // ผลลัพธ์หลังทำการ map คือ [1, 2, 3, 4]

        // ------------------------ ใช้กับรูปภาพ -------------------------------- //
        const image_profilet = [];
        if (req.files?.filesToUpload) {
          // ตรวจสอบว่าไฟล์ถูกอัปโหลดในฟิลด์ filesToUpload หรือไม่
          for (let file of req.files.filesToUpload) {
            // ลูปผ่านทุกไฟล์ที่อยู่ใน req.files.filesToUpload
            try {
              const uploadedFile = await cloudinaryUpload(
                file.buffer, // ส่งข้อมูลไฟล์
                file.originalname, // ส่งชื่อไฟล์เดิม
              );
              image_profilet.push(uploadedFile.url); // เก็บ URL ของไฟล์ที่อัปโหลด
            } catch (error) {
              console.error("Cloudinary upload error:", error.message);
              return res.status(500).json({
                message: "File upload failed",
                error: error.message,
              });
            }
          }
        }

        // -------------------------- ชุดนี้แปลงข้อมูลและก็รวม Url ---------------------- //
        function isValidUrl(url) {
          const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
          return regex.test(url);
        }

        const validUrlst = req.body.validUrls
          .split(",")
          .map((url) => url.trim()); // แปลงเป็น array และลบช่องว่าง

        const allImageUrls = [
          ...validUrlst.filter((url) => isValidUrl(url)), // กรอง URL ที่ถูกต้อง
          ...image_profilet.filter((url) => isValidUrl(url)), // กรอง URL ที่ถูกต้อง
        ];
        console.log("Combined Image URLs:", allImageUrls);

        // --------------- ชุดนี้แปลงข้อมูลให้ตรงกับ data type ใน database เพื่อเก็บกลับเข้าไป -----------//
        let image_profile = allImageUrls;
        const imageProfileJson = JSON.stringify(image_profile);
        const img = JSON.parse(imageProfileJson);
        // console.log("imageProfileJson", imageProfileJson);

        if (!id) {
          return res.status(400).json({ error: "User ID is required." });
        }

        try {
          const updateQuery = `
          UPDATE user_profiles 
          SET 
            name = $1,
            date_of_birth = $2,
            city_id = (
                SELECT city_id
                FROM city
                WHERE city_name = $3
                ),
            location_id = (
                SELECT location_id
                FROM location
                WHERE location_name = $4
                ),
            gender_id = (
                SELECT gender_id
                FROM gender
                WHERE gender_name = $5
                ),
            sexual_preference_id = (
                SELECT gender_id
                FROM gender
                WHERE gender_name = $6
                ),
            racial_preference_id = (
                SELECT racial_id
                FROM racial_identity
                WHERE racial_name = $7
                ),
            meeting_interest_id = (
                SELECT meeting_interest_id
                FROM meeting_interest
                WHERE meeting_name = $8
                ),
            hobbies_id = $9::int[],
            image_profile = $10::text[],
            about_me = $11
          WHERE user_id = $12
          RETURNING *;
        `;

          // const deleteHobbiesQuery = `
          //   DELETE FROM hobbies_profiles
          //   WHERE profile_id IN (
          //     SELECT profile_id FROM user_profiles WHERE user_id = $1
          //   );
          // `;

          // const insertHobbiesQuery = `
          //   INSERT INTO hobbies_profiles (profile_id, hobbies_id)
          //   SELECT profile_id, unnest($2::int[])
          //   FROM user_profiles
          //   WHERE user_id = $1;
          // `;

          // UPDATE user_profiles
          await connectionPool.query(updateQuery, [
            name,
            date_of_birth,
            city,
            location,
            gender,
            sexual_preference,
            racial_preference,
            meeting_interest,
            hobbyIds,
            img,
            about_me,
            id,
          ]);

          // DELETE hobbies
          // await connectionPool.query(deleteHobbiesQuery, [id]);

          // INSERT hobbies
          // if (hobbies && hobbies.length > 0) {
          //   await connectionPool.query(insertHobbiesQuery, [id, hobbyIds]);
          // }

          return res
            .status(200)
            .json({ message: "Profile updated successfully." });
        } catch (error) {
          console.error("Database error:", error);
          return res
            .status(500)
            .json({ error: "Failed to update user profile." });
        }
      },
    );
  } else if (req.method === "DELETE") {
    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }
    try {
      const query = `DELETE FROM users WHERE user_id = $1`;
      await connectionPool.query(query, [id]);

      return res.status(200).json({ message: `User ${id} has been deleted!` });
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Failed to delete user account." });
    }
  }
}
