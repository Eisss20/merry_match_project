import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user_id, packages_id, amount, currency, stripe_price_id } =
      req.body;

    // ตรวจสอบว่า amount มีค่าที่ถูกต้อง
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    try {
      // สร้าง Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: currency || "thb",
        metadata: { user_id, packages_id, stripe_price_id },
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
