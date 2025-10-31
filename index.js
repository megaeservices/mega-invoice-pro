const express = require('express');
const cors = require('cors');
const { db } = require('./firebase-config');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoints
app.get('/api/settings/profile', async (req, res) => {
  try {
    const doc = await db.collection('settings').doc('companyProfile').get();
    if (!doc.exists) {
      return res.status(404).send('Company profile not found.');
    }
    res.json(doc.data());
  } catch (error) {
    console.error("Error fetching company profile:", error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/settings/profile', async (req, res) => {
  try {
    const profileData = req.body;
    await db.collection('settings').doc('companyProfile').set(profileData, { merge: true });
    res.status(200).send('Company profile updated successfully.');
  } catch (error) {
    console.error("Error updating company profile:", error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
