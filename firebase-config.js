// Firebase configuration for Protein & Carb Labels
// هذا الملف يربط النظام مع Firestore
const firebaseConfig = {
  apiKey: "AIzaSyDRXIyvDmGgoKRYJEm2pVBE1pv3SQSWlwk",
  authDomain: "protin-and-carp-labels.firebaseapp.com",
  projectId: "protin-and-carp-labels",
  storageBucket: "protin-and-carp-labels.firebasestorage.app",
  messagingSenderId: "946120100164",
  appId: "1:946120100164:web:b1608bc1688c6bdd3caf11",
  measurementId: "G-L5K2KDZTKQ"
};

firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore();
