// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDO8wGSznq10OMPOwJrAeoPImj7wrfx11Q",
  authDomain: "personalwebsite-matthewahn.firebaseapp.com",
  projectId: "personalwebsite-matthewahn",
  storageBucket: "personalwebsite-matthewahn.firebasestorage.app",
  messagingSenderId: "7098038487",
  appId: "1:7098038487:web:85bc0fc56e581133c95892",
  measurementId: "G-GMQW118R7V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Set up Google as a provider for authentication
const provider = new GoogleAuthProvider();

// Function to sign in a user
export function signInUser() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("User signed in: ", user.displayName);
      trackUserInFirestore(user);
    })
    .catch((error) => {
      console.error("Error signing in: ", error);
    });
}

window.signInUser = signInUser;


// Function to track user in Firestore
async function trackUserInFirestore(user) {
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      name: user.displayName,
      email: user.email,
      lastLogin: new Date()
    }, { merge: true });
    console.log("User tracked in Firestore:", user.displayName);

    // Optionally display user info in the HTML
    document.getElementById("userInfo").innerHTML = `
      <p>Welcome, ${user.displayName}!</p>
      <p>Email: ${user.email}</p>
    `;
  } catch (error) {
    console.error("Error tracking user: ", error);
  }
}