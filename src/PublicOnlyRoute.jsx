import { Navigate } from "react-router-dom";
import {useEffect,useState} from "react";
import { onAuthStateChanged} from "firebase/auth";
import { auth } from "./firebase";

function PublicOnlyRoute({children}){
    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return ()=> unsubscribe();
    }, []);

    if(loading){
        return <h2>Loading...</h2>
    }

    if(user){
        return <Navigate to="/" replace />
    }

    return children
}
export default PublicOnlyRoute