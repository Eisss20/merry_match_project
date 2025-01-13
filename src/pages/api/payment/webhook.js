import Stripe from "stripe";
import connectionPool from "@/utils/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handleEvent(event) {
  try {
    const paymentIntent = event.data.object;

    // **บันทึกข้อมูลลงฐานข้อมูล**
    // ใส่โค้ดสำหรับบันทึกข้อมูล เช่น INSERT ลง SQL
    // ดึงข้อมูลที่ต้องการจาก paymentIntent
    const gatewayTransactionId = paymentIntent.id;
    const paymentMethod = paymentIntent.payment_method_types[0]; // เช่น 'card'
    const currency = paymentIntent.currency.toUpperCase(); // เช่น 'THB'
    const paymentDate = new Date(paymentIntent.created * 1000); // แปลง timestamp

    // สมมติว่ามี package_id และ user_id ใน metadata
    const packageId = paymentIntent.metadata.packages_id;
    const userId = paymentIntent.metadata.user_id;

    // ตรวจสอบ Metadata
    if (!packageId || !userId) {
      console.error("Missing metadata in paymentIntent:", {
        packageId,
        userId,
      });
      throw new Error("Missing metadata in paymentIntent.");
    }

    const paymentStatus = "Success"; // สำเร็จแล้ว

    const insertPaymentQuery = `
       INSERT INTO payment (currency_id, gateway_transaction_id, payment_method, payment_date, package_id, user_id, payment_status)
       VALUES (
         (SELECT currency_id FROM currency WHERE currency_code = $1 LIMIT 1),
         $2, $3, $4, $5, $6, $7
       );
     `;

    const values = [
      currency, // currency เช่น 'THB'
      gatewayTransactionId, // paymentIntent.id
      paymentMethod, // เช่น 'card'
      paymentDate, // วันที่ชำระเงิน
      packageId, // package_id จาก metadata
      userId, // user_id จาก metadata
      paymentStatus, // 'succeeded'
    ];

    // ใช้ connection แบบแยก
    const client = await connectionPool.connect();
    try {
      await client.query("BEGIN");
      await client.query(insertPaymentQuery, values);
      await client.query("COMMIT");
      console.log("Database insert successful");
    } catch (dbErr) {
      await client.query("ROLLBACK");
      console.error("Database transaction error:", dbErr);
      throw dbErr;
    } finally {
      client.release(); // คืน connection กลับ pool
    }
  } catch (err) {
    console.error("Error in handleEvent:", err);
    throw err;
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      // อ่าน rawBody จาก request
      const rawBody = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });
        req.on("end", () => {
          resolve(data);
        });
        req.on("error", (err) => {
          reject(err);
        });
      });
      console.log("Raw Body:", rawBody);

      // สร้าง Event จาก Stripe Webhook
      const event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        endpointSecret,
      );

      if (event.type === "payment_intent.succeeded") {
        await handleEvent(event);
      } else {
        console.log(`Unhandled event type: ${event.type}`);
      }
      res.status(200).json({ received: true });
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      res.status(400).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).send(`Method ${req.method} Not Allowed`);
  }
}
