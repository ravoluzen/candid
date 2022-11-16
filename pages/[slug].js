import Candid from "../components/Candid";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  console.log('routeData', routeData.id)

  // Submitting a thought
  const submitComment = async () => {
    if(!auth.currentUser) return router.push("/auth/login")

    if(!comment) {
        toast.error("Don't shoot an empty thought!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1500,
        });
        return;
    }
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
        thoughts: arrayUnion({
            comment,
            avatar: auth.currentUser.photoURL,
            username: auth.currentUser.displayName,
            time: Timestamp.now(),
        }),
    });
    setComment("");
  }

  // Get all thoughts
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
        setAllComments(snapshot.data().thoughts);
    });
    return unsubscribe;
  }

  useEffect(() => {
    if(!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
        <Candid { ...routeData }></Candid>
        <div className="my-4">
            <div className="flex">
                <input 
                    onChange={(e) => setComment(e.target.value)}
                    type="text"
                    value={comment}
                    placeholder="Express your thoughts"
                    className="bg-gray-800 w-full text-white text-sm p-2"
                />
                <button 
                    onClick={submitComment}
                    className="bg-cyan-500 text-white py-2 px-4 text-sm">
                    Submit
                </button>
            </div>
            <div>
                <h2>Thoughts</h2>
                {allComments?.map((comment) => (
                    <div className="bg-white p-4 my-4 border-2" key={comment.id}>
                        <div className="flex items-center gap-2 mb-4">
                            <img className="w-10 rounded-full" src={comment.avatar} alt="" />
                            <h2>{comment.username}</h2>
                        </div>
                        <h2>{comment.comment}</h2>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}
