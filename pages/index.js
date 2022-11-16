import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import Candid from '../components/Candid';
import { db } from "../utils/firebase";


export default function Home() {
  // Creating a state with all the posts
  const [allPosts, setAllPosts] = useState([]);

  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({...doc.data() })))
    });
    return unsubscribe;
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="my-12 text-lg font-medium">
      <h2>See what other people are candid about!</h2>
      {allPosts.map((post) => (
        <Candid {...post}></Candid>
      ))}
    </div>
  )
}
