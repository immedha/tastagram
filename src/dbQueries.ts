import { getFirestore, doc, setDoc, getDoc, DocumentData } from "firebase/firestore";

export const initializeUser = async (username: string, userId: string) => {
  const db = getFirestore();
  const userRef = doc(db, "users", userId);
  console.log('initializing user', username);
  const userData = {
    username,
    photos: [], // Empty array for user's uploaded photos
    likedTags: [], // Empty array for liked tags
    dislikedTags: [], // Empty array for disliked tags
    recentlyViewedPhotos: [], // Empty array for recently viewed photos
    feed: [], // Empty array for personalized feed
  };

  try {
    await setDoc(userRef, userData);
    console.log("User initialized successfully.");
  } catch (error) {
    console.error("Error initializing user:", error);
  }
}

export const fetchUserData = async (userId: string) => {
  const db = getFirestore();
  const userRef = doc(db, "users", userId);

  try {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData: DocumentData = userDoc.data();
      console.log("User data fetched successfully:", userData);
      return userData;
    } else {
      console.error("User document does not exist.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
