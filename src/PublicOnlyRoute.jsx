import { Navigate } from "react-router-dom";
import {useEffect,useState} from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged} from "firebase/auth";
import { auth,db } from "./firebase";

function PublicOnlyRoute({children}){
    const [userRole,setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, async(user) => {
            if(!user){
            setIsLoggedIn(false);
            setUserRole(null);
            setLoading(false);
            return;
           }
           setIsLoggedIn(true);

           try{
             const docRef= doc(db, "users", user.uid);
             const snapshot = await getDoc(docRef);
             if(snapshot.exists()){
                setUserRole(snapshot.data().role);
             }
            }catch(error){
                console.error("Error checking publicroute", error);
             }
           setLoading(false);
        });
        return ()=> unsubscribe();
    }, []);

    if(loading){
        return <h2>Loading...</h2>
    }

    if(isLoggedIn){
         if (userRole === "admin") {
            return <Navigate to="/pages/Admin-dashboard" replace />;
        }

        return <Navigate to="/" replace />
    }

    return children
}
export default PublicOnlyRoute