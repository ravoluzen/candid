import Link from 'next/link';
import { auth } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Nav() {
  const [user, loading] = useAuthState(auth);
  console.log(user)
  return (
    <nav className="font-bold flex justify-between items-center py-10 font-poppins">
        <Link href="/">
            <button className="text-lg font-medium">Candid</button>
        </Link>
        <ul className="flex items-center gap-10 font-medium text-white text-sm">
            {user ? (
                <div className="flex items-center gap-6">
                    <Link href="/post">
                        <button className="py-2 px-4 bg-purple-500 rounded-lg ml-8">
                            Post
                        </button>
                    </Link>
                    <Link href="/dashboard">
                        <img 
                          src={user.photoURL} 
                          alt="user's profile photo" 
                          className="w-12 rounded-full cursor-pointer"
                        />
                    </Link>
                </div>
            ):
            (
                <Link href="/auth/login">
                    <button className="py-2 px-4 bg-purple-500 rounded-lg ml-8">
                        Hop in!
                    </button>
                </Link>
            )}
        </ul>
    </nav>
  )
}
