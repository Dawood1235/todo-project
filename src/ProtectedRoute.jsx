// import {Outlet, Navigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import { useContext } from "react";
// import { userContext } from "./ContextProvider";

// // import { doc, getDoc } from 'firebase/firestore';
// // import { db } from "../firebase";

//  const ProtectedRoute = ( { children,roles } )=>{

//    const{role, user} = useContext(userContext);

//     if(!user){
//        return <Navigate to="/pages/Signin" replace/>
//     }

//    //  if((users.role) !== role){
//    //       return <Navigate to="/Unauthhorized" replace/>        
//    //  }

//     if(!roles.includes(role)){
//          return <Navigate to="/Unauthhorized" replace/>         
//     }

//    return children
// }
// export default ProtectedRoute;


import { Navigate } from "react-router-dom";

import { auth, db } from "./firebase";

import { doc, getDoc } from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


function ProtectedRoute({children,role}){

    const [loading,setLoading]=useState(true);

    const [allowed,setAllowed]=useState(false);

    const [authenticated,setAuthenticated] = useState(false);

    const navigate = useNavigate();

    useEffect(()=>{

        const unsubscribe=
        onAuthStateChanged(auth,async(user)=>{

            if(!user){

                setAuthenticated(false);

                setAllowed(false);

                setLoading(false);

                return;

            }

            setAuthenticated(true);

            const docRef=doc(db,"users",user.uid);

            const snapshot=await getDoc(docRef);

            if(snapshot.exists()){

                const data=snapshot.data();
                console.log("User document:", data);
                console.log("Firestore role:", data.role);
                console.log("Required role:", role);

                if( data.role === 'admin'){

                    setAllowed(true);
                    navigate("/pages/Admin-dashboard");

                }

                else if(data.role === 'user'){
                    setAllowed(true);
                    navigate("/");
                }

                else{

                    setAllowed(false);

                }

            }

            else{

                setAllowed(false);

            }

            setLoading(false);

        });

        return unsubscribe;

    },[role]);

    if(loading){

        return <h2>Loading...</h2>;

    }

    if(!authenticated){

        return <Navigate to="/Signin"/>;

    }

    if(!allowed){
        return  <Navigate to="/unauthorized"/>
    }

    return children

}

export default ProtectedRoute;