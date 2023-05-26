import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClqr888aato003DYnocnWi02xQUpjcbvw",
  authDomain: "meeting-management-app-767a7.firebaseapp.com",
  projectId: "meeting-management-app-767a7",
  storageBucket: "meeting-management-app-767a7.appspot.com",
  messagingSenderId: "309780300375",
  appId: "1:309780300375:web:f990b1427b818be67d1912",
  measurementId: "G-85K611M9DY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(app);

export { auth, db };
