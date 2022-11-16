import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Login() {
  const googleProvider = new GoogleAuthProvider();
  const [user, loading] = useAuthState(auth);
  const route = useRouter();


  // Signing in with google
  const GoogleLogin = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider)
        console.log("result", result)
        route.push("/");
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    if(user) {
        // if user already logged in, push them to home
        route.push("/");
    } else {
        // if user missing, inform to log in
        console.log("Please Login")
    }
  }, [user]);

  return (
    <div className="shadow-xl mt-32 p-10 text-gray-700">
        <h2 className="text-2xl font-medium">Enter the dragon!</h2>
        <div className="py-4">
            <h3 className="py-4">
                Sign in with the options below:
            </h3>
            <button
              onClick={GoogleLogin}
              className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4"
            >
                <FcGoogle className="text-2xl mx-1" />
                Sign in with Google
            </button>
        </div>
    </div>
  )
}
