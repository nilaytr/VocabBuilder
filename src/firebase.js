import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "FIREBASE_API_KEY",
  authDomain: "FIREBASE_AUTH_DOMAIN",
  projectId : "FIREBASE_PROJECT_ID",
  storageBucket: "FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "FIREBASE_SENDER_ID",
  appId: "FIREBASE_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

//kelime ekleme
export const addWord = async (wordData, userId) => {
  console.log("Adding word:", wordData);
  const docRef = await addDoc(collection(db, "dictionary"), {
    ...wordData,
    ownerId: userId,
    createdAt: new Date(),
  });
  console.log("Word added with ID:", docRef.id);
};

//kelime getirme
export const getUserWords = async (userId) => {
  const q = query(collection(db, "dictionary"), where("ownerId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

//kelime silme
export const deleteWord = async (wordId) => {
  await deleteDoc(doc(db, "dictionary", wordId));
};

export default app;