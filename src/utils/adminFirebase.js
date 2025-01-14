import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.SERVICE_ACCOUNT_KEY_BASE64, "base64").toString(
      "utf8",
    ),
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export const adminSdk = admin;
