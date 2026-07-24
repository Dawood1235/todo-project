import { useEffect,useState } from "react";
import {Doughnut,Bar } from "react-chartjs-2";
import Navbar from "./Navbar";


import{
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
} from "chart.js";

import {
    collection,
    getDocs
} from "firebase/firestore";

import {db} from "./firebase";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

export default function Statistics(){
    const [users, setUsers] = useState([]);  
    const totalUsers = users.filter((user)=>user.role === "user").length;
    const totalAdmins = users.filter((user)=>user.role === "admin").length;

    const roleChartData = {
        labels: ["Users", "Admin"],
        datasets: [
            {
                label: "Number of Accounts",
                data: [totalUsers, totalAdmins],
                borderWidth: 1,
                backgroundColor: [
                "rgba(88, 233, 100, 0.5)",
                "rgba(255,0,0,1)"   
                ]
            }
        ]
    };
   
    useEffect(()=>{
        const fetchUsers = async () => {

            try{
                const querySnapshot = await getDocs(
                    collection(db,"users")
                );

                const usersList = querySnapshot.docs.map(
                    (doc) => ({
                        id: doc.id,
                        ...doc.data()
                    })
                );

                setUsers(usersList);

            } catch (error) {

                console.error(
                    "error fetching users:", error
                );
            }
        };
        fetchUsers();
    }, [])


    
    return(
        <div>
            <Navbar/>
            <h1>Statistics</h1>
             <div className="d-flex">
            <h2 style={{marginLeft: "50px", marginBottom: "20px", marginTop: "50px"}}> Total Users : {users.length} </h2>
            </div>
            <div className="d-flex justify-content-center">
                <div style={{width: "400px", marginBottom: "10px"}}>
                    <Doughnut
                         data = {roleChartData}/>
                </div>
            </div>
        </div>
    );
};