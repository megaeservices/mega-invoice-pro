const express = require('express');
const cors = require('cors');
const { db } = require('./firebase-config');
const checkAuth = require('./authMiddleware');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoints
app.get('/api/settings/profile', checkAuth, async (req, res) => {
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

app.post('/api/settings/profile', checkAuth, async (req, res) => {
  try {
    const profileData = req.body;
    await db.collection('settings').doc('companyProfile').set(profileData, { merge: true });
    res.status(200).send('Company profile updated successfully.');
  } catch (error) {
    console.error("Error updating company profile:", error);
    res.status(500).send('Internal Server Error');
  }
});

// Customer Management Endpoints

// POST /api/customers - Create a new customer
app.post('/api/customers', checkAuth, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const customerData = {
      name,
      email,
      phone,
      address,
      userId: req.user.uid,
    };
    const docRef = await db.collection('customers').add(customerData);
    res.status(201).json({ id: docRef.id, ...customerData });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET /api/customers - Fetch all customers for the logged-in user
app.get('/api/customers', checkAuth, async (req, res) => {
  try {
    const snapshot = await db.collection('customers').where('userId', '==', req.user.uid).get();
    const customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).send('Internal Server Error');
  }
});

// PUT /api/customers/:id - Update a specific customer
app.put('/api/customers/:id', checkAuth, async (req, res) => {
  try {
    const customerId = req.params.id;
    const customerRef = db.collection('customers').doc(customerId);
    const doc = await customerRef.get();

    if (!doc.exists) {
      return res.status(404).send('Customer not found.');
    }

    if (doc.data().userId !== req.user.uid) {
      return res.status(403).send('Forbidden: You do not have permission to update this customer.');
    }

    const { name, email, phone, address } = req.body;
    await customerRef.update({ name, email, phone, address });
    res.status(200).json({ id: customerId, name, email, phone, address });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE /api/customers/:id - Delete a specific customer
app.delete('/api/customers/:id', checkAuth, async (req, res) => {
  try {
    const customerId = req.params.id;
    const customerRef = db.collection('customers').doc(customerId);
    const doc = await customerRef.get();

    if (!doc.exists) {
      return res.status(404).send('Customer not found.');
    }

    if (doc.data().userId !== req.user.uid) {
      return res.status(403).send('Forbidden: You do not have permission to delete this customer.');
    }

    await customerRef.delete();
    res.status(200).send('Customer deleted successfully.');
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Invoice Management Endpoints

// POST /api/invoices - Create a new invoice
app.post('/api/invoices', checkAuth, async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      issueDate,
      dueDate,
      items,
      subtotal,
      total,
      soldBy,
      salesChannel,
    } = req.body;

    const invoiceData = {
      customerName,
      customerEmail,
      issueDate,
      dueDate,
      items,
      subtotal,
      total,
      soldBy,
      salesChannel,
      userId: req.user.uid,
    };

    const docRef = await db.collection('invoices').add(invoiceData);
    res.status(201).json({ id: docRef.id, ...invoiceData });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET /api/invoices - Fetch all invoices for the logged-in user
app.get('/api/invoices', checkAuth, async (req, res) => {
  try {
    const snapshot = await db.collection('invoices').where('userId', '==', req.user.uid).get();
    const invoices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
