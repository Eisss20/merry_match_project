import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/adminFirebase";
import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("req.body:", req.body);
      // ดึง user_master, user_other จาก Body
      const { user_master, user_other } = req.body;

      console.log("user_master:", user_master);
      console.log("user_other:", user_other);

      // ตรวจสอบว่า user_master และ user_other มีค่าหรือไม่
      if (!user_master || !user_other) {
        return res.status(400).json({
          error: "Both user_master and user_other are required.",
        });
      }

      if (user_master === user_other) {
        return res
          .status(400)
          .json({ error: "You cannot match with yourself." });
      }

      // ตรวจสอบข้อมูลในฐานข้อมูล
      const checkQuery = `
        SELECT user_master, user_other FROM Matching 
        WHERE user_master = $1 AND user_other = $2;
      `;
      const checkResult = await connectionPool.query(checkQuery, [
        user_master,
        user_other,
      ]);

      if (checkResult.rows.length > 0) {
        return res.status(409).json({
          error: "This match already exists.",
          data: checkResult.rows[0],
        });
      }

      // Insert ข้อมูลใหม่
      const insertQuery = `
        INSERT INTO Matching (user_master, user_other)
        VALUES ($1, $2)
        RETURNING user_master, user_other;
      `;
      const insertResult = await connectionPool.query(insertQuery, [
        user_master,
        user_other,
      ]);

      // If matches, get date_match for inserting to chat room
      const matchCheckQuery = `
        SELECT matching_id, date_match
        FROM matching 
        WHERE ((user_master = $1 AND user_other = $2)
        OR (user_master = $2 AND user_other = $1))
        AND is_match = true;
      `;
      const matchCheckResult = await connectionPool.query(matchCheckQuery, [
        user_master,
        user_other,
      ]);

      console.log("matchCheckResult:", matchCheckResult.rows);

      if (matchCheckResult.rows.length > 0) {
        const chatRoomId = uuidv4();

        // Retrieve matching_id and date_match from matching table
        const { date_match } = matchCheckResult.rows[0];

        const [{ matching_id: matching_id_1 }, { matching_id: matching_id_2 }] =
          matchCheckResult.rows;

        console.log("date_match:", date_match);
        console.log("matching_id_1:", matching_id_1);
        console.log("matching_id_2:", matching_id_2);

        // SQL: Add data in chats table
        const chatsQuery = `
          INSERT INTO chats (matching_id, chat_room_id, user_master, user_other, created_at)
          VALUES
            ($1, $3, $4, $5, $6),
            ($2, $3, $5, $4, $6);
        `;
        const chatsValue = [
          matching_id_1,
          matching_id_2,
          chatRoomId,
          user_master,
          user_other,
          date_match,
        ];

        await connectionPool.query(chatsQuery, chatsValue);

        // NoSQL: Create empty chat room
        const chatRoomRef = db.collection("chat_rooms").doc(chatRoomId);
        await chatRoomRef.set({
          createdAt: date_match,
          messages: [],
        });

        return res.status(201).json({
          message: "Matches and created chat room successfully",
          chatRoomId,
        });
      }

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
