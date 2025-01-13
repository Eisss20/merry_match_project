import { db, adminSdk } from "@/utils/adminFirebase";
import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userMasterId, filter } = req.query;

    if (!filter) {
      return res.status(500).json({ error: "Required filter query" });
    }

    // SQL: Fetch all matches data
    const otherUserDataQuery = `
      SELECT chats.chat_room_id, matching.user_other, user_profiles.name, user_profiles.image_profile[1], chats.created_at
      FROM matching
      LEFT JOIN chats
      ON matching.matching_id = chats.matching_id
      LEFT JOIN user_profiles
      ON matching.user_other = user_profiles.user_id
      WHERE matching.user_master = $1 AND is_match = true
      ORDER BY chats.chat_room_id ASC
    `;
    const otherUserDataValues = [userMasterId];

    const otherUserDataResult = await connectionPool.query(
      otherUserDataQuery,
      otherUserDataValues,
    );

    console.log("otherUserDataResult", otherUserDataResult.rows);

    // Early return if no single match is found
    if (otherUserDataResult.rows.length === 0) {
      return res.status(200).json([]);
    }

    // Return matches data
    if (filter === "matches") {
      const matchesData = otherUserDataResult.rows;

      // Sort the matchesData array by chat room created date
      matchesData.sort((a, b) => b.created_at - a.created_at);

      return res.status(200).json([...matchesData]);
    } else if (filter === "lastChats") {
      const chatRoomIds = otherUserDataResult.rows.map(
        (row) => row.chat_room_id,
      );

      // NoSQL: Fetch all last messages from chat rooms
      let lastMessages = [];
      if (chatRoomIds.length > 0) {
        const chunkSize = 10;
        const chunks = [];

        for (let i = 0; i < chatRoomIds.length; i += chunkSize) {
          chunks.push(chatRoomIds.slice(i, i + chunkSize));
        }

        const lastMessagesPromises = chunks.map(async (chunk) => {
          const snapshot = await db
            .collection("chat_rooms")
            .where(adminSdk.firestore.FieldPath.documentId(), "in", chunk)
            .select("lastMessage")
            .get();

          return snapshot.docs.map((doc) => ({
            chatRoomId: doc.id,
            lastMessage: doc.data().lastMessage || null,
          }));
        });

        lastMessages = (await Promise.all(lastMessagesPromises)).flat();
      }

      // Combine SQL data with last messages
      const lastChats = otherUserDataResult.rows
        .map((sqlData) => {
          const lastMessageData = lastMessages.find(
            (msg) => msg.chatRoomId === sqlData.chat_room_id,
          );

          return {
            ...sqlData,
            lastMessage: lastMessageData ? lastMessageData.lastMessage : null,
          };
        })
        .filter((chatRoom) => chatRoom.lastMessage !== null);

      // Sort the lastMessages array by timestamp
      lastChats.sort((a, b) => {
        const timestampA = a.lastMessage.timestamp.toDate();
        const timestampB = b.lastMessage.timestamp.toDate();
        return timestampB - timestampA;
      });

      // Return last messages data
      return res.status(200).json([...lastChats]);
    }
  } catch (error) {
    console.error("Error fetching matches or chats:", error);
    return res.status(500).json({ error: "Unable to fetch matches or chats" });
  }
}
