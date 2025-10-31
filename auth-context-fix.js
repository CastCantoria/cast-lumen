// Correctif pour AuthContext.jsx
// À appliquer MANUELLEMENT

// 1. AJOUTER ces imports en haut du fichier :
import { 
  collection,
  query,
  where,
  getDocs,
  limit 
} from 'firebase/firestore';

// 2. AJOUTER cette fonction APRÈS les imports :

// � FONCTION CORRIGÉE POUR TROUVER LE RÔLE
const getUserRole = async (user) => {
  console.log("� DÉBUT getUserRole pour:", user.email);
  
  try {
    // 1. D'abord chercher dans 'admins' (priorité haute)
    const adminQuery = query(
      collection(db, 'admins'),
      where('email', '==', user.email),
      limit(1)
    );
    
    const adminSnapshot = await getDocs(adminQuery);
    console.log("� Résultat query admins:", adminSnapshot.size, "documents");
    
    if (!adminSnapshot.empty) {
      const adminData = adminSnapshot.docs[0].data();
      console.log("� Rôle admin trouvé:", adminData.role);
      return adminData.role;
    }
    
    // 2. Ensuite chercher dans 'members'
    const memberQuery = query(
      collection(db, 'members'),
      where('email', '==', user.email),
      limit(1)
    );
    
    const memberSnapshot = await getDocs(memberQuery);
    console.log("� Résultat query members:", memberSnapshot.size, "documents");
    
    if (!memberSnapshot.empty) {
      const memberData = memberSnapshot.docs[0].data();
      console.log("� Rôle membre trouvé:", memberData.role);
      return memberData.role || 'membre';
    }
    
    console.log("❌ Aucun rôle trouvé, défaut: public");
    return 'public';
    
  } catch (error) {
    console.error("� Erreur getUserRole:", error);
    return 'public';
  }
};

// 3. REMPLACER la fonction getUserProfile existante par :

const getUserProfile = async (user) => {
  try {
    console.log("� AUTHCONTEXT - Recherche profil pour:", user.email);
    
    // 1. Chercher dans admins d'abord
    const adminQuery = query(
      collection(db, 'admins'),
      where('email', '==', user.email),
      limit(1)
    );
    
    const adminSnapshot = await getDocs(adminQuery);
    if (!adminSnapshot.empty) {
      const adminData = adminSnapshot.docs[0].data();
      console.log("✅ Profil ADMIN trouvé:", adminData.role);
      return {
        uid: user.uid,
        email: user.email,
        displayName: adminData.displayName || user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || null,
        role: adminData.role,
        createdAt: adminData.createdAt || serverTimestamp(),
        lastLogin: serverTimestamp(),
        isActive: true,
        source: 'admins'
      };
    }
    
    // 2. Chercher dans members
    const memberQuery = query(
      collection(db, 'members'),
      where('email', '==', user.email),
      limit(1)
    );
    
    const memberSnapshot = await getDocs(memberQuery);
    if (!memberSnapshot.empty) {
      const memberData = memberSnapshot.docs[0].data();
      console.log("✅ Profil MEMBRE trouvé:", memberData.role);
      return {
        uid: user.uid,
        email: user.email,
        displayName: memberData.displayName || user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || null,
        role: memberData.role || 'membre',
        createdAt: memberData.createdAt || serverTimestamp(),
        lastLogin: serverTimestamp(),
        isActive: true,
        source: 'members'
      };
    }
    
    // 3. Créer un profil par défaut
    console.log("� Création profil par défaut");
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || null,
      role: 'public',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      isActive: true,
      source: 'new'
    };
    
  } catch (error) {
    console.error('❌ Erreur récupération profil:', error);
    return null;
  }
};

// 4. Dans la fonction login, CHANGER :
// const profile = await getUserProfile(user.uid);
// PAR :
// const profile = await getUserProfile(user);
