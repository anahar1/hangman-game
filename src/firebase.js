import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
} from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtqG-yWeRPDyGJzKljd5OM9v2kvSGKq8A",
  authDomain: "lighthall-challenge-3-3d6e5.firebaseapp.com",
  projectId: "lighthall-challenge-3-3d6e5",
  storageBucket: "lighthall-challenge-3-3d6e5.appspot.com",
  messagingSenderId: "373560323903",
  appId: "1:373560323903:web:23420cce24450532b86d8a",
  measurementId: "G-15X0WWYE4Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

export const addUser = async (name) => {
  const docRef = doc(firestore, "Users", name);
  const data = {
    score: 0,
  };
  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      console.log("Document exists");
    } else {
      setDoc(docRef, data)
        .then(() => {
          console.log("Document has been added successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  } catch (error) {
    console.log("Error checking if document exists:", error);
    return false;
  }
};

export const getScores = async () => {
  try {
    const scoresRef = collection(firestore, "Users");
    const snapshot = await getDocs(scoresRef);
    const scores = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const { score } = data;
      const name = doc.id;
      scores.push({ name, score });
    });

    // Sort scores in descending order and return top 10
    scores.sort((a, b) => b.score - a.score);
    console.log("JEL", scores.slice(0, 10));
    return scores.slice(0, 10);
  } catch (error) {
    console.log("Error retrieving scores from Firestore", error);
  }
};

export const getCurrentUser = async () => {
  try {
    const docRef = doc(firestore, "Current", "currentUser");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.name;
    } else {
      console.log("No current user found in Firestore");
      return null;
    }
  } catch (error) {
    console.log('Error retrieving current user from Firestore', error);
    return null;
  }
};

export const setCurrentUser = async (name) => {
  const currentUserRef = doc(firestore, "Current", "currentUser");
    const data = {
      name: name
    };
    try {
      await setDoc(currentUserRef, data, { merge: true });
      console.log("Current user created successfully");
    } catch (error) {
      console.log("Error creating current user:", error);
    }
};

export const getUserScore = async (name) => {
  const docRef = doc(firestore, "Users", name);
  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data().score;
    } else {
      console.log("Document does not exist");
      return 0; // or any default value you prefer
    }
  } catch (error) {
    console.log("Error getting document:", error);
    return 0; // or any default value you prefer
  }
};


// update total score
export const setScores = async (name, totalScore) => {
  console.log(name, totalScore)
  const docRef = doc(firestore, "Users", name);
  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const data = {
        score: totalScore,
      };
      await updateDoc(docRef, data);
      console.log(`Score updated for user ${name}`);
    } else {
      console.log(`User ${name} not found in Firestore`);
    }
  } catch (error) {
    console.log(`Error updating score for user ${name}:`, error);
  }
};
