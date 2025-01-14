import connectionPool from "@/utils/db";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import multer from "multer";
import jwt from "jsonwebtoken";

// ตั้งค่า Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ตั้งค่า multer ให้ใช้ MemoryStorage
const multerUpload = multer({ storage: multer.memoryStorage() });

// กำหนด config สำหรับ Next.js API Route (ต้องปิด bodyParser)
export const config = {
  api: {
    bodyParser: false, // ปิด bodyParser เพื่อให้ multer จัดการ request body เอง
  },
};

// ฟังก์ชันอัปโหลดไฟล์ไปยัง Cloudinary โดยใช้ Buffer
const cloudinaryUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// ฟังก์ชันฟอร์แมตวันที่และเวลา
const formatToThailandTime = (utcDate) => {
  if (!utcDate) return "Invalid Date";

  const date = new Date(utcDate); // แปลงเป็น Date object
  const formattedDate = date.toLocaleString("en-GB", {
    timeZone: "Asia/Bangkok",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // ใช้ AM/PM
  });

  // เอา `,` ออกและปรับ AM/PM เป็นตัวใหญ่
  return formattedDate.replace(",", "").replace("am", "AM").replace("pm", "PM");
};

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handle(req, res) {
  if (req.method === "POST") {
    // ใช้ multerUpload จัดการอัปโหลดไฟล์จาก FormData
    multerUpload.single("icon")(req, res, async (err) => {
      if (err) {
        console.error("File upload error:", err);
        return res
          .status(500)
          .json({ error: "File upload failed", details: err.message });
      }

      try {
        // ดึง token จาก Authorization Header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1]; // แยก token ออกจาก "Bearer <token>"

        let adminId;
        try {
          const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
          console.log("Decoded Token:", decodedToken);

          adminId = decodedToken.admin_id; // ดึง admin_id จาก payload ของ token
        } catch (err) {
          console.error("Invalid token:", err.message);
          return res.status(401).json({ error: "Invalid token" });
        }

        const { package_name, merry_limit, price, details } = req.body;

        // Validation ข้อมูล
        if (!package_name || !merry_limit || !price) {
          return res.status(400).json({ error: "Missing required fields." });
        }

        // แปลง price เป็นตัวเลข
        const numericPrice = Number(price);

        // แปลง `details` เป็น JSON
        let parsedDetails = [];
        if (details) {
          try {
            parsedDetails = JSON.parse(details); // แปลง JSON string กลับเป็น array
          } catch (error) {
            console.error("Error parsing details:", error.message);
            return res.status(400).json({ error: "Invalid details format." });
          }
        }

        // อัปโหลดรูปภาพไปยัง Cloudinary
        let iconUrl = null;
        if (req.file) {
          const uploadResult = await cloudinaryUpload(req.file.buffer);
          iconUrl = uploadResult.url; // เก็บเฉพาะ URL ของรูปภาพ
        }

        const currency_id = "11"; //THB
        const query = `
            INSERT INTO packages (name_package, description, limit_match, price, icon_url, created_date, updated_date, created_by, currency_id)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6, $7) RETURNING package_id  
          `;
        const values = [
          package_name,
          JSON.stringify(parsedDetails),
          merry_limit,
          numericPrice,
          iconUrl,
          adminId, // ใช้ adminId จาก token
          currency_id,
        ];

        const result = await connectionPool.query(query, values);
        const packageId = result.rows[0].package_id;

        // เพิ่ม Package ใน Stripe
        const product = await stripe.products.create({
          name: package_name,
          description: `Limit: ${merry_limit}, Price: ${numericPrice}`,
          images: iconUrl ? [iconUrl] : [],
        });

        const stripePrice = await stripe.prices.create({
          product: product.id,
          unit_amount: numericPrice * 100, // ราคาในหน่วย cents
          currency: "thb",
        });

        // บันทึก price_id ของ Stripe ลงใน Database
        await connectionPool.query(
          `UPDATE packages SET stripe_price_id = $1 WHERE package_id = $2`,
          [stripePrice.id, packageId],
        );

        return res.status(201).json({ message: "Package added successfully!" });
      } catch (error) {
        console.error("Database Error: ", error.message);
        console.error("Error Stack: ", error.stack);
        return res.status(500).json({ error: "Failed to add package." });
      }
    });
  } else if (req.method === "GET") {
    // ดึงข้อมูลแพ็กเกจทั้งหมด
    try {
      const query = `
      SELECT 
        package_id, 
        name_package, 
        description, 
        limit_match, 
        price, 
        icon_url, 
        created_date,
        updated_date,
        created_by, 
        currency_id 
      FROM packages 
      ORDER BY created_date DESC
    `;
      const { rows } = await connectionPool.query(query);

      // ฟอร์แมตวันที่สำหรับทุกแถว
      const formattedRows = rows.map((row) => ({
        ...row,
        created_date: formatToThailandTime(row.created_date),
        updated_date: row.updated_date
          ? formatToThailandTime(row.updated_date)
          : "Not updated",
      }));

      return res.status(200).json(formattedRows);
    } catch (error) {
      console.error("Database Error: ", error.message);
      return res.status(500).json({ error: "Failed to fetch packages." });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
