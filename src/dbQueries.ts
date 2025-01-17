import { getFirestore, doc, setDoc, getDoc, DocumentData, addDoc, arrayUnion, updateDoc, Firestore } from "firebase/firestore";
import { FEED_SIZE, FeedPhotoData } from "./store/storeStates";
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const initializeUserInDb = async (username: string, userId: string) => {
  const db = getFirestore();
  const userRef = doc(db, "users", userId);
  const userData = {
    username,
    photos: [], // Empty array for user's uploaded photos
    likedTags: [], // Empty array for liked tags
    dislikedTags: [], // Empty array for disliked tags
  };

  try {
    await setDoc(userRef, userData);
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

// export const generateNewFeed = async (likedTags: string[]) => {
//   // divide 10 by length of likedTags so each likedTag gets x photos in feed
//   const photosPerTag: number = (likedTags.length > 0) ? Math.floor(FEED_SIZE / likedTags.length) : 0;
//   let leftover = (likedTags.length > 0) ? (FEED_SIZE % likedTags.length) : FEED_SIZE;
//   const allPhotos: Set<string> = new Set<string>(); // do this for randomization within feed and to prevent duplicates
  
//   // for every tag in likedTags, query db for photosPerTag # of photos for tag
//   for (let i = 0; i < likedTags.length; i++) {
//     const tag = likedTags[i];
//     leftover += await fetchPhotosForTag(tag, photosPerTag, allPhotos);
//   }
  
//   // query db for leftover # of photos that have random tags
//   await fetchRandomPhotos(leftover, allPhotos);
  
//   // convert set to array
//   return photoIdsToFeedInfo(allPhotos);
// }

// const photoIdsToFeedInfo = async (photoIds: Set<string>): Promise<FeedPhotoData[]> => {
//   // loop through photoIds and query photos collection in db for that photoId document
//   // get data in that document and put in result array
//   const feed: FeedPhotoData[] = new Array(FEED_SIZE);
//   const db = getFirestore();
//   const photosCollection = collection(db, "photos");
//   const photoIdsArray = Array.from(photoIds);
//   for (let i = 0; i < photoIdsArray.length; i++) {
//     const photoId = photoIdsArray[i];
//     const photoRef = doc(photosCollection, photoId);
//     const photoDoc = await getDoc(photoRef);
//     if (photoDoc.exists()) {
//       const photoData: DocumentData = photoDoc.data();
//       feed[i] = {
//         photoId,
//         name: photoData.name,
//         photoUrl: photoData.photoUrl,
//         userId: photoData.userId,
//         username: photoData.username,
//         tags: photoData.tags,
//       };
//     } else {
//       console.error(`Photo document for ${photoId} does not exist.`);
//     }
//   }
//   return feed;
// }

// const fetchPhotosForTag = async (tag: string, amt: number, allPhotos: Set<string>): Promise<number> => {
//   const db = getFirestore();
//   const tagRef = doc(db, "tags", tag);
//   const tagDoc = await getDoc(tagRef);

//   if (!tagDoc.exists()) {
//     console.error(`Tag document for ${tag} does not exist.`);
//     return amt; // If tag does not exist, all photos are still needed
//   }

//   const tagData: DocumentData = tagDoc.data();
//   const photos: string[] = tagData.photos || [];
  
//   let used = 0;
//   for (let i = 0; i < photos.length && used < amt; i++) {
//     const curr = photos[i];
//     if (!allPhotos.has(curr)) {
//       allPhotos.add(curr);
//       used++;
//     }
//   }
//   return amt - used;
// }

// const fetchRandomPhotos = async (amt: number, allPhotos: Set<string>) => {
//   // in each iteration from i = 1->amt, get a random doc from tags collection in db
//   // loop through all photos in this tag and try to get 1 photo not already in allPhotos into it
//   // add it to allPhotos
//   const db = getFirestore();
//   const tagsCollection = collection(db, "tags");
//   const tagsSnapshot = await getDocs(tagsCollection);
//   const tagsDocs = tagsSnapshot.docs;

//   let i = 0;
//   while (i < tagsDocs.length && amt > 0) {
//     const photosInTag = tagsDocs[i].data().photos || [];
//     for (let j = 0; j < photosInTag.length; j++) {
//       const curr = photosInTag[j];
//       if (!allPhotos.has(curr)) {
//         allPhotos.add(curr);
//         amt--;
//         break;
//       }
//     }
//     i++;
//     if (amt > 0 && i === tagsDocs.length) {
//       i = 0;
//     }
//   }
// }

export const generateNewFeed = async (likedTags: string[]): Promise<FeedPhotoData[]> => {
  const db = getFirestore();
  const result: FeedPhotoData[] = [];
  const usedPhotoIds: Set<string> = new Set();
  const photosPerTag: number = likedTags.length > 0 ? Math.floor(FEED_SIZE / likedTags.length) : 0;
  let leftover: number = likedTags.length > 0 ? FEED_SIZE % likedTags.length : FEED_SIZE;

  // Step 1: Fetch photos for each likedTag
  const tagFetchPromises = likedTags.map((tag) =>
    fetchPhotosForTag(db, tag, photosPerTag, usedPhotoIds, result)
  );
  const tagLeftovers = await Promise.all(tagFetchPromises);
  leftover += tagLeftovers.reduce((sum, count) => sum + count, 0);

  // Step 2: Fetch random leftover photos
  await fetchRandomPhotos(db, leftover, usedPhotoIds, result);

  return result;
};

const fetchPhotosForTag = async (
  db: Firestore,
  tag: string,
  amt: number,
  usedPhotoIds: Set<string>,
  result: FeedPhotoData[]
): Promise<number> => {
  const photosCollectionRef = collection(db, `tags/${tag}/photos`);
  const tagSnapshot = await getDocs(photosCollectionRef);

  let usedCount = 0;
  for (const doc of tagSnapshot.docs) {
    const photoId = doc.id;
    if (!usedPhotoIds.has(photoId) && usedCount < amt) {
      const photoData = doc.data();
      result.push({
        photoId,
        name: photoData.name,
        photoUrl: photoData.photoUrl,
        userId: photoData.userId,
        username: photoData.username,
      });
      usedPhotoIds.add(photoId);
      usedCount++;
    }
  }

  return amt - usedCount; // Return how many more photos are needed
};

const fetchRandomPhotos = async (
  db: Firestore,
  amt: number,
  usedPhotoIds: Set<string>,
  result: FeedPhotoData[]
): Promise<void> => {
  const photosCollectionRef = collection(db, "photos");
  const randomSnapshot = await getDocs(photosCollectionRef);

  let usedCount = 0;
  for (const doc of randomSnapshot.docs) {
    const photoId = doc.id;
    if (!usedPhotoIds.has(photoId) && usedCount < amt) {
      const photoData = doc.data();
      result.push({
        photoId,
        name: photoData.name,
        photoUrl: photoData.photoUrl,
        userId: photoData.userId,
        username: photoData.username,
      });
      usedPhotoIds.add(photoId);
      usedCount++;
    }
  }
};

export const setLikedTagsInDb = async (userId: string, likedTags: string[]) => {
  // in db, set likedTags field in userId document in users collection to likedTags array
  const db = getFirestore();
  const userRef = doc(db, "users", userId);
  try {
    await setDoc(userRef, { likedTags }, { merge: true });
  } catch (error) {
    console.error("Error updating liked tags:", error);
  }
}

export const setDislikedTagsInDb = async (userId: string, dislikedTags: string[]) => {
  // in db, set dislikedTags field in userId document in users collection to dislikedTags array
  const db = getFirestore();
  const userRef = doc(db, "users", userId);
  try {
    await setDoc(userRef, { dislikedTags }, { merge: true });
  } catch (error) {
    console.error("Error updating disliked tags:", error);
  }
}

export const savePhotoToStorage = async (file: File): Promise<string> => {
  try {
    // Initialize Firebase Storage
    const storage = getStorage();

    // Create a storage reference with a unique path
    const storageRef = ref(storage, `photos/${Date.now()}_${file.name}`);

    // Upload the file to Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL; // Return the download URL
  } catch (error) {
    console.error("Error uploading photo to Firebase Storage:", error);
    throw error; // Propagate the error for handling
  }
};

export const savePhotoToDb = async (userId: string, username: string, name: string, photoUrl: string, tags: string[]): Promise<string> => {
  // add a doc to photos collection in db with fields for name, photoUrl, tags
  // return the id of the doc
  const db = getFirestore();
  const photosCollection = collection(db, "photos");
  try {
    const docRef = await addDoc(photosCollection, {
      userId, 
      username,
      name,
      photoUrl,
      tags,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving photo to db:", error);
    throw error;
  }
}

export const addPhotoToUser = async (userId: string, photoId: string, photoUrl: string): Promise<void> => {
  try {
    const db = getFirestore();

    // Reference to the user document
    const userDocRef = doc(db, "users", userId);

    // Add the photo to the photos array field
    await updateDoc(userDocRef, {
      photos: arrayUnion({ photoId, photoUrl }),
    });

  } catch (error) {
    console.error("Error adding photo to user:", error);
    throw error; // Propagate error for handling
  }
};

export const addPhotoToTags = async (userId: string, username: string, name: string, photoUrl: string, tags: string[], photoId: string): Promise<void> => {
  // loop through tags and add a new photoId doc in photos collection in tag document in tags collection (basically put new photoId doc in tags/tag/photos/)
  // if that tag document does not already exist, create one and add a photos collection in it and add a photoId doc to it
  // in the photoId doc, add fields for name, photoUrl, userId, username
  const db = getFirestore();
  const tagsCollection = collection(db, "tags");
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    const tagRef = doc(tagsCollection, tag, "photos", photoId);
    try {
      await setDoc(tagRef, {
        name,
        photoUrl,
        userId,
        username,
      });
    } catch (error) {
      console.error(`Error adding photo to tag ${tag}:`, error);
    }
  }
}

export const getTagsOfPhoto = async (photoId: string): Promise<string[]> => {
  const db = getFirestore();
  const photoRef = doc(db, "photos", photoId);

  try {
    const photoDoc = await getDoc(photoRef);
    if (photoDoc.exists()) {
      const photoData: DocumentData = photoDoc.data();
      return photoData.tags || [];
    } else {
      console.error("Photo document does not exist.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching photo tags:", error);
    return [];
  }
}

export const usernameExists = async (username: string): Promise<boolean> => {
  // query users collection in db for document with username field equal to username
  const db = getFirestore();
  const usersCollection = collection(db, "users");
  // loop through all docs in the collection and check if the username field is equal to the username
  const usersSnapshot = await getDocs(usersCollection);
  const usersDocs = usersSnapshot.docs;
  for (let i = 0; i < usersDocs.length; i++) {
    const userDoc = usersDocs[i];
    const userData = userDoc.data();
    if (userData.username === username) {
      return true;
    }
  }
  return false;
}