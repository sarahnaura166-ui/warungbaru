const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// Inisialisasi Firebase Admin SDK
// Pastikan variabel environment sudah diset di Vercel
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Mengatasi newline pada private key di environment variable Vercel
      privateKey: process.env.FIREBASE_PRIVATE_KEY 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
        : undefined,
    }),
  });
}

const db = admin.firestore();

// --- CONTOH ENDPOINT API ---

// 1. Ambil daftar produk warung
app.get('/api/products', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// Inisialisasi Firebase Admin SDK
// Pastikan variabel environment sudah diset di Vercel
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Mengatasi newline pada private key di environment variable Vercel
      privateKey: process.env.FIREBASE_PRIVATE_KEY 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
        : undefined,
    }),
  });
}

const db = admin.firestore();

// --- CONTOH ENDPOINT API ---

// 1. Ambil daftar produk warung
app.get('/api/products', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Tambah produk baru ke warung
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const docRef = await db.collection('products').add({
      name,
      price: Number(price),
      stock: Number(stock),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(201).json({ success: true, id: docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ekspor handler untuk Vercel Serverless Function
module.exports = app;.message });
  }
});

// 2. Tambah produk baru ke warung
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const docRef = await db.collection('products').add({
      name,
      price: Number(price),
      stock: Number(stock),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(201).json({ success: true, id: docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ekspor handler untuk Vercel Serverless Function
module.exports = app;