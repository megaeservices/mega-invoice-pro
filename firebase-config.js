const admin = require('firebase-admin');

// IMPORTANT: Replace this with your actual Firebase service account credentials
const serviceAccount = {
  // "type": "service_account",
  // "project_id": "your-project-id",
  // "private_key_id": "your-private-key-id",
  // "private_key": "your-private-key",
  // "client_email": "your-client-email",
  // "client_id": "your-client-id",
  // "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  // "token_uri": "https://oauth2.googleapis.com/token",
  // "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  // "client_x509_cert_url": "your-client-x509-cert-url"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { db };
