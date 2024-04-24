import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "fir-ac8c0.firebaseapp.com",
  projectId: "fir-ac8c0",
  storageBucket: "fir-ac8c0.appspot.com",
  messagingSenderId: "482640887087",
  appId: "1:482640887087:web:7b152bde6509008fef35da",
  measurementId: "G-WSPFDJ8VSV"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;