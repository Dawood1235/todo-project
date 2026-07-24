import { createContext,useEffect,useState } from 'react';
import { auth,db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";

export const UserContext = createContext()

export function UserProvider({ children }){
    const [user,setUser] = useState(null);
    const [role,setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect (()=>{
        const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {
            if(!currentUser){
                setUser(null);
                setRole(null);
                setLoading(false);
                return;
            }

            setUser(currentUser);

            try{
                const docRef = doc(db, "users", currentUser.uid);
                const snapshot = await getDoc(docRef);
                if(snapshot.exists()){
                    setRole(snapshot.data().role);
                }
                else{
                    setRole(null);
                }
            } catch(error){
                console.error("Error fetching role", error);
                setRole(null);
            }
            setLoading(false);
        });
        return ()=> unsubscribe();
    }, []);

    return(<UserContext.Provider value={{user,role,loading}}>
        {children}
    </UserContext.Provider>);}
