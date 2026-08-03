import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export default function Unauthorized() {
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("User signed out");
        } catch (error) {
            console.log("Sign out error:", error);
        }
    };

    return (
        <div>
            <h1>You are not authorized</h1>

            <button onClick={handleSignOut}>
                Sign Out
            </button>
        </div>
    );
}
