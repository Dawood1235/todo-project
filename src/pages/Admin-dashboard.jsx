import { useEffect, useState } from "react";
import { db } from "../firebase";
import SPLoader from "./Loader";
import { Link } from "react-router-dom";
import {
    collection,
    endAt,
    getDocs,
    startAt,
    query,
    limit,
    startAfter,
    orderBy
} from "firebase/firestore";
import Navbar from "../Navbar";


const AdminDashboard = ({ role }) => {

    console.log("admi page----------role", role);
    const [currentPage,setCurrentPage] = useState(1);
    const [lastDocs,setLastDocs] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const usersPerPage = 10;
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const searchUsers = async(searchText,lastDocs=null) => {
        const text = searchText.trim().toLowerCase();

        if(!text){
            fetchUsers();
            return;
        }

        try{
            let q;
            if(lastDocs){
            q = query(
                collection(db,"users"),
                orderBy("lowerfirstName"),
                startAt(text),
                endAt(text + "\uf8ff"),
                startAfter(lastDocs),
                limit(usersPerPage + 1)
            );
            } else{
                
            q = query(
                collection(db,"users"),
                startAt(text),
                endAt(text + "\uf8ff"),
                orderBy("lowerfirstName"),
                limit(usersPerPage + 1)
                );
            }
            const snapshot = await getDocs(q);

            const results = snapshot.docs
                .slice(0,usersPerPage).map((doc)=>({
                    id:doc.id,
                    ...doc.data()
                }));

            setUsers(results);
            if(snapshot.docs.length>usersPerPage){
                setLastDocs(snapshot.docs[usersPerPage-1]);
                setHasNextPage(true);
            }
            else{
                setHasNextPage(false);

            }
        } catch(error){
            console.log("search error",error);
        }
    };


    // useEffect(() => {

      
const fetchUsers = async(lastDocs = null)=>{
     try{
            let q;
            if(lastDocs){
            q = query(
                collection(db,"users"),
                orderBy("lowerfirstName"),
                startAfter(lastDocs),
                limit(usersPerPage)
            );
            } else{
                
            q = query(
                collection(db,"users"),
                orderBy("lowerfirstName"),
                limit(usersPerPage + 1)
                );
            }
            const querySnapshot = await getDocs(q);

            const usersArray = querySnapshot.docs
                .slice(0,usersPerPage).map((doc)=>({
                    id:doc.id,
                    ...doc.data()
                }));

            setUsers(usersArray);
            if(querySnapshot.docs.length>usersPerPage){
                setLastDocs(querySnapshot.docs[usersPerPage-1]);
                setHasNextPage(true);
            }
            else{
                setHasNextPage(false);

            }
        } catch(error){
            console.log("search error",error);
        }
    setLoading(false);
};

useEffect(()=>{

    setLastDocs(null);
    setCurrentPage(1);
    if(search.trim()===""){
        fetchUsers();
    }
    else{
        searchUsers(search);
    }
}, [search]);

    if (loading) {
        return <SPLoader />;
    }




    // const indexOfLastUser = currentPage * usersPerPage;
    // const indexOfFirstUser = indexOfLastUser - usersPerPage;

    // const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // const totalPages = Math.ceil(users.length / usersPerPage);

    return (

        <div>
            <Navbar />
            <div className="dashboard">
                <h1>Admin Dashboard</h1>
                <input 
                type="text"
                className="form-control mb-3"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                />

                <h2>All Registered Users</h2>

                <table border="1" cellPadding="10">

                    <thead>

                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Role</th>

                        </tr>

                    </thead>

                    <tbody>

                        {users.map((user) => (

                            <tr key={user.id}>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>
                <div>
                    <button 
                        disabled={currentPage===1}
                        onClick={()=>setCurrentPage(currentPage-1)}
                    >Previous
                    </button>

                    <span>
                        Page {currentPage}
                    </span>

                    <button 
                        disabled={!hasNextPage}
                        onClick={()=>{setCurrentPage(currentPage+1)
                        if(search.trim()===""){
                            fetchUsers(lastDocs);
                        }
                        else{
                            searchUsers(search, lastDocs)
                        }
                    }}
                    >Next
                    </button>

                </div>


            </div>

        </div>

    );

};

export default AdminDashboard;