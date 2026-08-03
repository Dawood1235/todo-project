import { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import SPLoader from "./pages/Loader";
import Navbar from "./Navbar";


import {
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

import { db } from "./firebase";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

export default function Statistics() {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const totalUsers = users.filter((user) => user.role === "user").length;
    const totalAdmins = users.filter((user) => user.role === "admin").length;

    useEffect(() => {
        const fetchTasks = async () => {
            const snapshot = await getDocs(collection(db, "tasks"));

            const tasksList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setTasks(tasksList);
        };

        fetchTasks();
    }, []);

    const CompletedTasks = tasks.filter(task => task.status === "Completed").length;

    const PendingTasks = tasks.filter(task => task.status === "Pending").length;

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

    useEffect(() => {
        setLoading(true);
        const fetchUsers = async () => {

            try {
                console.log("fetchSignInMethodsForEmail..");
                const querySnapshot = await getDocs(
                    collection(db, "users")
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
            finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [])

    if (loading) {
        return <SPLoader />
    }

    return (
        <div>
            <Navbar /><div className="statistics">
                <h1>Statistics</h1>

                <div className="stats-container">

                    <div className="stat-card completed-card">
                        <h3>Completed Tasks</h3>
                        <p>{CompletedTasks}</p>
                    </div>

                    <div className="stat-card pending-card">
                        <h3>Pending Tasks</h3>
                        <p>{PendingTasks}</p>
                    </div>
                    
                <div className="stat-card">
                <h2> Total Users : {users.length} </h2>
                </div>


                </div>
            </div>
            <div className="d-flex justify-content-center">
                <div style={{ width: "400px", marginBottom: "10px" }}>
                    <Doughnut
                        data={roleChartData} />
                </div>
            </div>
        </div>
    );
};