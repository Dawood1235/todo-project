import { createContext,useEffect,useState } from 'react';
import axios from "axios";

export const UserContext = createContext()

export function UserProvider({ children }){
    const [user,setUser] = useState(null);
    const [role,setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect (()=>{
        const fetchuser = async()=> {
            try{
                const token = localStorage.getItem("token");

                if(!token){
                    setUser(null);
                    setRole(null);
                    setLoading(false);
                    return;
                }

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUser(response.data);
            setRole(response.data.role);

        } catch(error){
            console.error("Error fetching user:", error);

            setUser(null);
            setRole(null);
        }
        finally{
            setLoading(false);
        }
    }
        fetchuser();
    }, []);

    return(<UserContext.Provider value={{user,setUser,role,loading}}>
        {children}
    </UserContext.Provider>);}
