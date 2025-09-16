import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCDM4A5m0698jvKwsoNwEHr5Qmr9l30TDA",
  authDomain: "migrant-health-d51de.firebaseapp.com",
  projectId: "migrant-health-d51de",
  storageBucket: "migrant-health-d51de.firebasestorage.app",
  messagingSenderId: "645875539033",
  appId: "1:645875539033:web:4f83a38585d0ad3a87e548",
  measurementId: "G-R5TL25Y688"
};
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);