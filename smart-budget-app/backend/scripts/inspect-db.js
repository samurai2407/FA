// scripts/inspect-db.js  — run with: node scripts/inspect-db.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection.db;

const collections = await db.listCollections().toArray();

if (collections.length === 0) {
  console.log('Database is empty — no collections yet.');
} else {
  for (const col of collections) {
    const count = await db.collection(col.name).countDocuments();
    console.log(`\n=== ${col.name} (${count} document(s)) ===`);
    const docs = await db.collection(col.name).find({}).limit(3).toArray();
    console.log(JSON.stringify(docs, null, 2));
  }
}

await mongoose.disconnect();
console.log('\nDone.');
