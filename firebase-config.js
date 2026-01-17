// Firebase Configuration
// IMPORTANT: Replace these with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > Your Apps > Web App

const firebaseConfig = {
  apiKey: "AIzaSyClwl3F0V0Jt4OKJ7daY_g9TkWlMwln4Lg",
  authDomain: "wsstud.firebaseapp.com",
  projectId: "wsstud",
  storageBucket: "wsstud.firebasestorage.app",
  messagingSenderId: "777053990740",
  appId: "1:777053990740:web:9057a9fae2888003ae62c1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Enable Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Configure persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

console.log(‘🔥 Firebase initialized!’);
