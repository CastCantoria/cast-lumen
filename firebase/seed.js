// firebase/seed.js - Script pour peupler la base de données initiale
import { db } from '../src/lib/firebase.js';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

const seedData = async () => {
  console.log('?? Début du seeding Firebase...');
  
  // Collection des configurations
  const configs = {
    site: {
      name: "C.A.S.T. Cantoria",
      description: "Chœur Artistique & Spirituel de Tanà",
      founded: 2003,
      contact: {
        email: "castcantoria@gmail.com",
        phone: "+261 34 11 361 57"
      }
    }
  };
  
  try {
    // Créer les configurations
    await setDoc(doc(db, 'configurations', 'site'), configs.site);
    console.log('? Configurations créées');
    
    console.log('?? Seeding terminé avec succès !');
  } catch (error) {
    console.error('? Erreur lors du seeding:', error);
  }
};

// Exécuter le seeding
seedData();
