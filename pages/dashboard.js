import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from 'next/router';
import Link from "next/link";
import { async } from "@firebase/util";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import Candid from "../components/Candid";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

export default function Dashboard() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  // console.log(auth)

  const getData = async () => {
    if(loading) return;
    if(!user) return router.push("/auth/login");
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where('user', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id:doc.id })))
    });
    return unsubscribe;
  };

  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  }

  useEffect(() => {
    getData();
  })


  return (
    <div>
        <h1>Your Candids</h1>
        <div>
            {posts.map((post) => (
                <Candid {...post} key={post.id}>
                    <div className="flex gap-4 text-sm">
                        <button 
                            onClick={() => deletePost(post.id)}
                            className="text-pink-600 flex items-center justify-center gap-2 py-2">
                            <BsTrash2Fill className="text-2xl"/>
                            Delete
                        </button>
                        <Link href={{ pathname: "/post", query: post}}>
                            <button className="text-teal-600 flex items-center justify-center gap-2 py-2">
                                <AiFillEdit className="text-2xl"/>
                                Edit
                            </button>
                        </Link>
                    </div>
                </Candid>
            ))}
        </div>
        <button 
            onClick={() => auth.signOut()}
            className="font-medium text-white bg-gray-800 py-2 px-4 my-4 rounded-md"
        >
            Hop Out
        </button>
    </div>
  )
}
