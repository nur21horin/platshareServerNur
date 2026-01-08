const admin = require("firebase-admin");

function parseServiceAccount() {
  const firebaseServiceKeyB64 = process.env.FIREBASE_SERVICE_KEY;
  if (!firebaseServiceKeyB64) {
    throw new Error("Missing FIREBASE_SERVICE_KEY environment variable");
  }

  try {
    const decoded = Buffer.from(firebaseServiceKeyB64, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch (error) {
    throw new Error("Failed to decode FIREBASE_SERVICE_KEY");
  }
}

function initializeFirebaseAdmin() {
  if (admin.apps?.length) {
    return admin;
  }

  const serviceAccount = parseServiceAccount();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return admin;
}

module.exports = initializeFirebaseAdmin();

