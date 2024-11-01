// // Import Firebase libraries
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
// import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
// import { getFirestore, doc, setDoc, getDoc, collection } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
 
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDO8wGSznq10OMPOwJrAeoPImj7wrfx11Q",
//   authDomain: "personalwebsite-matthewahn.firebaseapp.com",
//   projectId: "personalwebsite-matthewahn",
//   storageBucket: "personalwebsite-matthewahn.firebasestorage.app",
//   messagingSenderId: "7098038487",
//   appId: "1:7098038487:web:85bc0fc56e581133c95892",
//   measurementId: "G-GMQW118R7V"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

// // Set up Google as a provider for authentication
// const provider = new GoogleAuthProvider();

// // Function to sign in a user
// export function signInUser() {
//   signInWithPopup(auth, provider)
//     .then((result) => {
//       const user = result.user;
//       console.log("User signed in: ", user.displayName);
//       trackUserInFirestore(user);
//     })
//     .catch((error) => {
//       console.error("Error signing in: ", error);
//     });
// }

// window.signInUser = signInUser;


// // Function to track user in Firestore
// async function trackUserInFirestore(user) {
//   try {
//     const userRef = doc(db, "users", user.uid);
//     await setDoc(userRef, {
//       name: user.displayName,
//       email: user.email,
//       lastLogin: new Date()
//     }, { merge: true });
//     console.log("User tracked in Firestore:", user.displayName);

//     // Optionally display user info in the HTML
//     document.getElementById("userInfo").innerHTML = `
//       <p>Welcome, ${user.displayName}!</p>
//       <p>Email: ${user.email}</p>
//     `;
//   } catch (error) {
//     console.error("Error tracking user: ", error);
//   }
// }
// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your web app's Firebase configuration
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
    
    // Try to get existing user document
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // User exists, update visit count and last login
      const userData = userDoc.data();
      await updateDoc(userRef, {
        timesVisited: (userData.timesVisited || 0) + 1,
        lastLogin: new Date(),
        lastVisitedDate: new Date().toLocaleString()
      });
      
      // Display updated user info
      displayUserInfo(user, userData.timesVisited + 1, new Date().toLocaleString());
    } else {
      // New user, create document
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        timesVisited: 1,
        firstLogin: new Date(),
        lastLogin: new Date(),
        lastVisitedDate: new Date().toLocaleString()
      });
      
      // Display new user info
      displayUserInfo(user, 1, new Date().toLocaleString());
    }
  } catch (error) {
    console.error("Error tracking user: ", error);
  }
}

// Function to display user information
function displayUserInfo(user, visitCount, lastVisitedDate) {
  const userInfoElement = document.getElementById("userInfo");
  if (userInfoElement) {
    userInfoElement.innerHTML = `
      <div class="user-details">
        <img src="${user.photoURL || 'default-avatar.png'}" alt="User Avatar" class="user-avatar">
        <div class="user-text">
          <h3>Welcome, ${user.displayName}!</h3>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Times Visited:</strong> ${visitCount}</p>
          <p><strong>Last Visited:</strong> ${lastVisitedDate}</p>
        </div>
      </div>
    `;
  }
}

// Optional: Add a function to handle sign-out
export function signOutUser() {
  auth.signOut()
    .then(() => {
      // Clear user info display
      const userInfoElement = document.getElementById("userInfo");
      if (userInfoElement) {
        userInfoElement.innerHTML = '<p>Please sign in</p>';
      }
      console.log("User signed out");
    })
    .catch((error) => {
      console.error("Error signing out: ", error);
    });
}

// Expose signOutUser to global scope if needed
window.signOutUser = signOutUser;