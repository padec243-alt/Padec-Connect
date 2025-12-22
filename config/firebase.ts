import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBCynBSw2U4Svr1BWm1Ygs0eVBmszjUfTI',
  authDomain: 'studio-1425628740-711cf.firebaseapp.com',
  projectId: 'studio-1425628740-711cf',
  storageBucket: 'studio-1425628740-711cf.firebasestorage.app',
  messagingSenderId: '553608525953',
  appId: '1:553608525953:web:c7e45f6eeaacd9c11ff580',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export default app;
