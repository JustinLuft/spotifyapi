import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function saveTopTracks(userId: string, tracks: any[]) {
  try {
    await addDoc(collection(db, "snapshots"), {
      userId,
      tracks,
      createdAt: serverTimestamp()
    });
    console.log("Snapshot saved!");
  } catch (err) {
    console.error("Error saving snapshot:", err);
  }
}
