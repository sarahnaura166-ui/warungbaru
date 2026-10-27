const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Sajikan halaman frontend dari folder public (untuk menjalankan lokal)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Inisialisasi Firebase Admin SDK
// Pastikan variabel environment sudah diset (.env lokal / Vercel)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Mengatasi newline pada private key di environment variable
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\n/g, '\n')
        : undefined,
    }),
  });
}

const db = admin.firestore();

// 1. Ambil daftar produk warung
app.get('/api/products', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('GET /api/products error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Tambah produk baru ke warung
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    if (!name || !name.toString().trim()) {
      return res.status(400).json({ success: false, error: 'Nama produk wajib diisi' });
    }
    const docRef = await db.collection('products').add({
      name: name.toString().trim(),
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('POST /api/products error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Jalankan langsung (lokal): node api/index.js
if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(`Server berjalan di http://localhost:${port}`));
}

// Ekspor handler untuk Vercel Serverless Function
module.exports = app;
