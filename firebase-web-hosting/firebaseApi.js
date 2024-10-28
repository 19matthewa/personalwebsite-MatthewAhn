// // Import the functions you need from the SDKs you need
// import { getFirestore, collection, getDocs } from  "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDO8wGSznq10OMPOwJrAeoPImj7wrfx11Q",
//   authDomain: "personalwebsite-matthewahn.firebaseapp.com",
//   projectId: "personalwebsite-matthewahn",
//   storageBucket: "personalwebsite-matthewahn.appspot.com",
//   messagingSenderId: "7098038487",
//   appId: "1:7098038487:web:85bc0fc56e581133c95892",
//   measurementId: "G-GMQW118R7V"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore();


// const studentsCollectionRef = collection(db, "students");
// console.log("hello world");
// let data;
// getDocs(studentsCollectionRef)
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       data = doc.data();
//       console.log(doc.id, " => ", data());
//     });
//   })
//   .catch((error) => {
//     console.error('Error getting documents', error);
//   });
// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDO8wGSznq10OMPOwJrAeoPImj7wrfx11Q",
  authDomain: "personalwebsite-matthewahn.firebaseapp.com",
  projectId: "personalwebsite-matthewahn",
  storageBucket: "personalwebsite-matthewahn.appspot.com",
  messagingSenderId: "7098038487",
  appId: "1:7098038487:web:85bc0fc56e581133c95892",
  measurementId: "G-GMQW118R7V"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();





// Get a reference to the "students" collection
const studentsCollectionRef = collection(db, "students");
 
// Get all documents from the collection
let data;
getDocs(studentsCollectionRef)
  .then((snapshot) => {
    // Loop through each document
    snapshot.docs.forEach((doc) => {
      // Get the document data
      data = doc.data();
      console.log(doc.id, " => ", data);
    });
  })
  .catch((error) => {
    console.error("Error getting documents: ", error);
  });