/*
  scripts/seedEvents.js

  This script attempts to seed Firestore with example events using the Firebase Admin SDK.
  Usage:
    1) Create a service account JSON for your Firebase project and set the path in the
       environment variable GOOGLE_APPLICATION_CREDENTIALS, or put the file next to this script
       and set SERVICE_ACCOUNT_PATH to its path.
    2) Run: node scripts/seedEvents.js

  The script will bail with an instruction if firebase-admin is not installed.
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  let admin;
  try {
    admin = (await import('firebase-admin')).default || (await import('firebase-admin'));
  } catch (err) {
    console.error('firebase-admin is not installed. Run: npm install firebase-admin --save');
    process.exit(1);
  }

  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.SERVICE_ACCOUNT_PATH;
  if (!serviceAccountPath) {
    console.error('No service account path provided. Set GOOGLE_APPLICATION_CREDENTIALS or SERVICE_ACCOUNT_PATH env var.');
    process.exit(1);
  }

  if (!fs.existsSync(serviceAccountPath)) {
    console.error('Service account file not found at', serviceAccountPath);
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(serviceAccountPath), 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const db = admin.firestore();

  const sample = [
    {
      title: 'Répetition générale',
      description: 'Répétition pour la préparation du concert d\'automne.',
      location: 'Salle municipale',
      section: 'tous',
      date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 3600 * 1000))
    },
    {
      title: 'Concert d\'inauguration',
      description: 'Concert spécial pour l\'inauguration de la saison.',
      location: 'Église Saint-Pierre',
      section: 'tous',
      date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 21 * 24 * 3600 * 1000))
    }
  ];

  try {
    for (const ev of sample) {
      const ref = await db.collection('events').add({ ...ev, createdAt: admin.firestore.FieldValue.serverTimestamp() });
      console.log('Created event', ref.id);
    }
    console.log('Seeding complete.');
  } catch (err) {
    console.error('Error seeding events:', err);
  }
}

main();
