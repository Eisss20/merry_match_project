import connectionPool from "@/utils/db";
import jwt from "jsonwebtoken";
import { db } from "@/utils/adminFirebase";

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userMasterId = decodedToken.id; // ดึง ID จาก Token

    if (req.method === "GET") {
      try {
        // Query Fetch Matches
        const matchQuery = `
          SELECT 
              Matching.user_other AS user_other,
              User_Profiles.name AS name,
              User_Profiles.age AS age,
              User_Profiles.about_me AS about_me,
              Gender.gender_name AS sexual_identity,
              SexualPreference.gender_name AS sexual_preference,
              Meeting_Interest.meeting_name AS meeting_interest,
              Racial_Identity.racial_name AS racial_preference,
              City.city_name AS city_name,
              Location.location_name AS location_name,
              JSON_AGG(
                  JSON_BUILD_OBJECT(
                      'image_url', Image_Profiles.image_profile_url,
                      'is_primary', Image_Profiles.is_primary
                  )
                  ORDER BY Image_Profiles.is_primary DESC -- เรียงภาพโดย is_primary ก่อน
              ) AS images,
              (
                  SELECT ARRAY_AGG(h.hobby_name ORDER BY ARRAY_POSITION(User_Profiles.hobbies_id, h.hobbies_id))
                  FROM hobbies h
                  WHERE h.hobbies_id = ANY(User_Profiles.hobbies_id)
              ) AS hobbies, -- รวมเฉพาะ hobby_name ที่เรียงตามลำดับใน User_Profiles.hobbies_id
              Matching.is_match AS is_match,
              Matching.date_match AS date_match,
              (
                  SELECT c.chat_room_id
                  FROM chats c
                  WHERE 
                    (c.user_master = Matching.user_master AND c.user_other = Matching.user_other)
                    OR (c.user_master = Matching.user_other AND c.user_other = Matching.user_master)
                  LIMIT 1
              ) AS chat_room_id -- เพิ่มการดึง chat_room_id ของ user_other
          FROM Matching
          JOIN User_Profiles ON Matching.user_other = User_Profiles.profile_id
          JOIN Gender ON User_Profiles.gender_id = Gender.gender_id
          JOIN Gender AS SexualPreference ON User_Profiles.sexual_preference_id = SexualPreference.gender_id
          JOIN Meeting_Interest ON User_Profiles.meeting_interest_id = Meeting_Interest.meeting_interest_id
          JOIN Racial_Identity ON User_Profiles.racial_preference_id = Racial_Identity.racial_id
          JOIN City ON User_Profiles.city_id = City.city_id
          JOIN Location ON City.location_id = Location.location_id
          LEFT JOIN Image_Profiles ON User_Profiles.profile_id = Image_Profiles.profile_id
          WHERE Matching.user_master = $1
          GROUP BY 
              Matching.user_other, Matching.user_master, User_Profiles.profile_id, Gender.gender_name, 
              SexualPreference.gender_name, Meeting_Interest.meeting_name, 
              Racial_Identity.racial_name, City.city_name, Location.location_name,
              Matching.is_match, Matching.date_match
          ORDER BY 
              CASE 
                  WHEN Matching.is_match = true THEN 1
                  ELSE 2
              END,
              CASE 
                  WHEN Matching.date_match::date = CURRENT_DATE THEN 1
                  ELSE 2
              END,
              Matching.date_match DESC,
              User_Profiles.name ASC;
        `;

        const countQuery = `
          SELECT 
            SUM(CASE WHEN is_match = true THEN 1 ELSE 0 END) AS total_true,
            SUM(CASE WHEN is_match = false THEN 1 ELSE 0 END) AS total_false
          FROM Matching
          WHERE user_master = $1;
        `;

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

        const detailHobbiesQuery = `
  SELECT 
      Matching.user_other AS user_other,
      (
          SELECT ARRAY_AGG(h.hobby_name ORDER BY h.hobby_name)
          FROM hobbies_profiles hp
          JOIN hobbies h ON hp.hobbies_id = h.hobbies_id
          WHERE hp.profile_id = User_Profiles.profile_id
      ) AS hobbies
  FROM Matching
  JOIN User_Profiles ON Matching.user_other = User_Profiles.profile_id
  WHERE Matching.user_master = $1
  ORDER BY 
      CASE 
          WHEN Matching.is_match = true THEN 1 -- แมทสำเร็จ แสดงบนสุด
          ELSE 2
      END,
      CASE 
          WHEN Matching.date_match::date = CURRENT_DATE THEN 1 -- แมทวันนี้ แสดงตามมา
          ELSE 2
      END,
      Matching.date_match DESC, -- แมทล่าสุดขึ้นบนเสมอ
      User_Profiles.name ASC; -- ชื่อเรียงลำดับตัวอักษร
`;

        const imageQuery = `
SELECT 
    Matching.user_other AS user_other,
    (
        SELECT JSON_AGG(
            ip.image_profile_url
        )
        FROM (
            SELECT DISTINCT 
                image_profiles.image_profile_url
            FROM image_profiles
            WHERE image_profiles.profile_id = User_Profiles.profile_id
            ORDER BY image_profiles.image_profile_url
        ) AS ip
    ) AS images
FROM Matching
JOIN User_Profiles ON Matching.user_other = User_Profiles.profile_id
WHERE Matching.user_master = $1
ORDER BY 
    CASE 
        WHEN Matching.is_match = true THEN 1 -- แมทสำเร็จ แสดงบนสุด
        ELSE 2
    END,
    CASE 
        WHEN Matching.date_match::date = CURRENT_DATE THEN 1 -- แมทวันนี้ แสดงตามมา
        ELSE 2
    END,
    Matching.date_match DESC, -- แมทล่าสุดขึ้นบนเสมอ
    User_Profiles.name ASC; -- ชื่อเรียงลำดับตัวอักษร

`;

        const [
          matchesResult,
          countResult,
          limitResult,
          hobbiesResult,
          imageResult,
        ] = await Promise.all([
          connectionPool.query(matchQuery, [userMasterId]),
          connectionPool.query(countQuery, [userMasterId]),
          connectionPool.query(limitQuery, [userMasterId]),
          connectionPool.query(detailHobbiesQuery, [userMasterId]),
          connectionPool.query(imageQuery, [userMasterId]),
        ]);

        if (limitResult.rows.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
          matches: matchesResult.rows,
          total_true: countResult.rows[0]?.total_true || 0,
          total_false: countResult.rows[0]?.total_false || 0,
          limit_info: limitResult.rows[0],
          hobbies: hobbiesResult.rows || [],
          images: imageResult.rows || [],
        });
      } catch (error) {
        console.error("Error fetching match list or limit info:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else if (req.method === "DELETE") {
      try {
        const { users_to_delete, chatroom_to_delete } = req.body;

        if (!Array.isArray(users_to_delete) || users_to_delete.length === 0) {
          return res.status(400).json({
            error: "Invalid input: users_to_delete must be a non-empty array.",
          });
        }

        // NoSQL delete all chat rooms in parallel using Promise.all
        if (chatroom_to_delete.length > 0) {
          const deletePromises = chatroom_to_delete.map((chatRoomId) => {
            const chatRoomRef = db.collection("chat_rooms").doc(chatRoomId);
            return chatRoomRef.delete();
          });

          // Wait for all deletions to complete
          await Promise.all(deletePromises);
        }

        // Delete user from match
        const deleteQuery = `
          DELETE FROM Matching
          WHERE user_master = $1 AND user_other = ANY($2::int[]) 
          RETURNING user_master, user_other;
        `;

        const result = await connectionPool.query(deleteQuery, [
          userMasterId,
          users_to_delete,
        ]);

        res.status(200).json({
          message: "Matches deleted successfully",
          deletedRecords: result.rows,
        });
      } catch (error) {
        console.error("Error deleting matches:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      res.setHeader("Allow", ["GET", "DELETE"]);
      res.status(405).json({ error: `Method ${req.method} Not Allowed.` });
    }
  } catch (error) {
    console.error("Invalid token:", error.message);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}
