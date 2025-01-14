import connectionPool from "@/utils/db"; // ใช้ connectionPool ที่คุณกำหนดไว้

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Query ดึงข้อมูล
      const query = `
        SELECT 
    complaint.complaint_id,       -- รหัสของเรื่องร้องเรียน
    user_profiles.name,           -- ชื่อของผู้ใช้
    complaint.user_id,            -- รหัสผู้ใช้ที่สร้างเรื่องร้องเรียน
    complaint.issue,              -- หัวข้อหรือปัญหาของเรื่องร้องเรียน
    complaint.description,        -- รายละเอียดของเรื่องร้องเรียน
    complaint.submited_date,      -- วันที่ส่งเรื่องร้องเรียน
    complaint_admin.status,       -- สถานะของเรื่องร้องเรียน เช่น New, Pending, Resolved
    complaint_admin.resolve_date, -- วันที่แก้ไขปัญหาเสร็จสมบูรณ์ (ถ้ามี)
    complaint_admin.canceled_date,-- วันที่ยกเลิกเรื่องร้องเรียน (ถ้ามี)
    complaint_admin.resolve_by_admin_id, -- รหัสแอดมินที่แก้ไขเรื่องร้องเรียน
    complaint_admin.canceled_by_admin_id -- รหัสแอดมินที่ยกเลิกเรื่องร้องเรียน
        FROM 
    complaint -- ตารางเรื่องร้องเรียนหลัก
        LEFT JOIN 
    complaint_admin -- ตารางที่เก็บข้อมูลการจัดการของแอดมิน
ON 
    complaint.complaint_id = complaint_admin.complaint_id -- เชื่อมตารางด้วย complaint_id
LEFT JOIN 
    user_profiles -- ตารางโปรไฟล์ผู้ใช้
ON 
    complaint.user_id = user_profiles.user_id -- เชื่อมตารางด้วย user_id (แก้ไขจาก users_id)
    ORDER BY complaint.complaint_id DESC;
      `;

      const result = await connectionPool.query(query); // รันคำสั่ง SQL
      res.status(200).json(result.rows); // ส่งผลลัพธ์กลับในรูปแบบ JSON
    } catch (error) {
      console.error("Error fetching complaints:", error.message); // Debug ข้อผิดพลาด
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message }); // ส่งข้อผิดพลาดกลับ
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`); // สำหรับ Method อื่นที่ไม่ใช่ GET
  }
}
