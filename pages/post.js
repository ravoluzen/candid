import { useState, useEffect } from "react";
import { auth, db } from "../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Post() {
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const routeData = router.query;
  console.log(router)
  
  const submitPost = async (e) => {
    e.preventDefault();
    const collectionRef = collection(db, 'posts');

    if(!post.description){
        toast.error("Description Field Empty", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1500,
        });
        return;
    }

    if(post.description.length > 300){
        toast.error("Description too long", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1500,
        });
        return; 
    }

    await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
    });
    setPost({ description: "" });
    return router.push("/")
  }

  // Checking user
  const checkUser = async () => {
    if(loading) return;
    if(!user) router.push("/auth/login");
    if(routeData.id){
        setPost({ description: routeData.description, id: routeData.id })
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="w-">
        <form onSubmit={submitPost}>
            <h1>
                {post.hasOwnProperty("id") ? "Edit your Candid" : "Create a Candid"}
            </h1>
            <div>
                <h3>
                    Description
                </h3>
                <textarea
                    value={post.description}
                    onChange={(e) => setPost({...post, description: e.target.value})}
                    className="bg-gray-200 rounded-lg p-4 w-64 h-48 active:border-none">

                </textarea>
                <p className={`text-purple-500 text-sm ${post.description.length >= 300 ? "text-red-500" : ""}`}>{post.description.length}/300</p>
            </div>
            <button
                type="submit"
                className="text-white rounded-lg p-2 bg-purple-500"
            >
                Submit
            </button>
        </form>
    </div>
  )
}
