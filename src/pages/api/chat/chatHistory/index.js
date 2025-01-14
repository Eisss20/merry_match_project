import { db } from "@/utils/adminFirebase";
import connectionPool from "@/utils/db";
import { protectUser } from "@/middleware/protectUser";

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await runMiddleware(req, res, protectUser);

    const { chatRoomId, userId } = req.query;

    // SQL: Fetch the chat room information to determine user roles
    const chatRoomUsersQuery = `
      SELECT user_master, user_other
      FROM chats
      WHERE chat_room_id = $1
    `;
    const chatRoomUsersValues = [chatRoomId];

    const chatRoomUsersResult = await connectionPool.query(
      chatRoomUsersQuery,
      chatRoomUsersValues,
    );

    if (chatRoomUsersResult.rows.length === 0) {
      return res.status(404).json({ error: "Chat room not found" });
    }

    const { user_master, user_other } = chatRoomUsersResult.rows[0];

    // Determine the "other user" dynamically
    const otherUserId = userId == user_master ? user_other : user_master;

    // SQL: Get other user data
    const otherUserDataQuery = `
      SELECT user_id, name, image_profile[1]
      FROM User_Profiles
      WHERE user_id = $1
    `;
    const otherUserDataValue = [otherUserId];

    const otherUserDataResult = await connectionPool.query(
      otherUserDataQuery,
      otherUserDataValue,
    );

    const otherUserData = otherUserDataResult.rows[0];

    // NoSQL: Get chat history
    const chatRoomRef = db.collection("chat_rooms").doc(chatRoomId);
    const chatRoomDoc = await chatRoomRef.get();

    if (!chatRoomDoc.exists) {
      return res.status(404).json({ error: "Chat room not found" });
    }

    const chatRoomData = chatRoomDoc.data();
    return res
      .status(200)
      .json({ otherUserData, messages: chatRoomData.messages || [] });
  } catch (error) {
    console.error("Error fetching chat room:", error);
    return res.status(500).json({ error: "Failed to fetch chat room" });
  }
}
