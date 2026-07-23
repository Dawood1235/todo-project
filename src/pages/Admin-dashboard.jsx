import { useEffect, useState } from "react";
import { db } from "../firebase";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import SPLoader from "./Loader";
import {Link} from "react-router-dom";
import {
  collection,
  getDocs
} from "firebase/firestore";

const AdminDashboard = ({role}) => {

 console.log("admi page----------role",role)
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    
        const navigate =  useNavigate();

        const handleLogout = async () => {

        await signOut(auth);

        navigate("/Signin");

    };

    useEffect(() => {

        const fetchUsers = async () => {

            try{

                const querySnapshot = await getDocs(
                    collection(db,"users")
                );

                const usersArray = [];

                querySnapshot.forEach((doc)=>{

                    usersArray.push({
                        id: doc.id,
                        ...doc.data()
                    });

                });
                console.log("Users fetched:", usersArray);
                setUsers(usersArray);

            }
            catch(error){
                console.log(error);
            }

            setLoading(false);

        };

        fetchUsers();

    },[]);


    if(loading){
        return <SPLoader/>;
    }

    return (

        <div className= "dashboard">

            <h1>Admin Dashboard</h1>

            <h2>All Registered Users</h2>

            <table border="1" cellPadding="10">

                <thead>

                    <tr>
                        <th>Email</th>
                        <th>Role</th>

                    </tr>

                </thead>

                <tbody>

                    {users.map((user)=>(

                        <tr key={user.id}>

                            <td>{user.email}</td>
                            <td>{user.role}</td>

                        </tr>

                    ))}

                </tbody>

            </table>
            
            <div id="lgstbtns">
            <button onClick = {handleLogout} >Logout </button>

            <Link to="/Statistics">
            <button>Statistics </button>
            </Link>
            </div>

        </div>

    );

};

export default AdminDashboard;