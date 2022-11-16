import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import Candid from '../components/Candid';
import { db } from "../utils/firebase";
import Link from 'next/link';


export default function Home() {
  // Creating a state with all the posts
  const [allPosts, setAllPosts] = useState([]);

  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({...doc.data() })))
    });
    console.log(allPosts)
    return unsubscribe;
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="my-12 text-lg font-medium">
      <h2>See what other people are candid about!</h2>
      {allPosts.map((post) => (
        <Candid key={post.id} {...post}>
          <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
            <button className="text-sm">{post.thoughts?.length > 0 ? post.thoughts.length : 0} thoughts</button>
          </Link>
        </Candid>
      ))}
    </div>
  )
}
