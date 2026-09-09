import { useEffect, useReducer } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import SPLoader from "./pages/Loader";
import Navbar from "./Navbar";
import axios from "axios";
import { useMemo } from "react";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
} from "chart.js";

// import {
//     collection,
//     getDocs
// } from "firebase/firestore";

// import { db } from "./firebase";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

export default function Statistics() {
    const initialState = {
        loading: false,
        totalUsers: 0,
        totalAdmins: 0,
        totalCompleted: 0,
        totalPending: 0,
        error: null
    }

    function reducer(state,action){
        switch(action.type){

            case "FETCH_START":
                return {
                    ...state,
                    loading:true,
                    error:null
                };
            case "FETCH_SUCCESS":
                return {
                    ...state,
                    loading: false,
                    totalUsers: action.payload.totalUsers,
                    totalAdmins: action.payload.totalAdmins,
                    totalCompleted: action.payload.totalCompleted,
                    totalPending: action.payload.totalPending
                }
            case "FETCH_ERROR":
                return{
                    ...state,
                    loading: false,
                    error: action.payload
                }
            default: 
                return state;
        }

    }

    const [state, dispatch] = useReducer(reducer, initialState);


    useEffect(() => {
        const fetchTasks = async () => {
            try {
                dispatch({type: "FETCH_START"});
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/admin/stats",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                console.log("WHOLE RESPONSE:", response);
                console.log("RESPONSE DATA:", response.data);
                console.log("PENDING:", response.data.totalPending);
                console.log("COMPLETED:", response.data.totalCompleted);

                console.log(response.data);

                dispatch({type:
                    "FETCH_SUCCESS",
                    payload: response.data
                })

            } catch (error) {
                dispatch({
                    type: "FETCH_ERROR",
                    payload: error.message
                })
            }
            // const snapshot = await getDocs(collection(db, "tasks"));

            // const tasksList = snapshot.docs.map(doc => ({
            //     id: doc.id,
            //     ...doc.data()
            // }));

            // setTasks(tasksList);
        };


        fetchTasks();
    }, []);

    // const CompletedTasks = tasks.filter(task => task.status === "Completed").length;

    // const PendingTasks = tasks.filter(task => task.status === "Pending").length;

    const roleChartData = useMemo(()=>{
        return{
        labels: ["Users", "Admin"],
        datasets: [
            {
                label: "Number of Accounts",
                data: [state.totalUsers, state.totalAdmins],
                borderWidth: 1,
                backgroundColor: [
                    "rgba(124, 92, 252, 1)",
                    "rgba(255,0,0,1)"
                ]
            }
        ]
        }
    }, [state.totalUsers, state.totalAdmins]);

    // useEffect(() => {
    //     setLoading(true);
    //     const fetchUsers = async () => {

    //         try {
    //             console.log("fetchSignInMethodsForEmail..");
    //             const querySnapshot = await getDocs(
    //                 collection(db, "users")
    //             );

    //             const usersList = querySnapshot.docs.map(
    //                 (doc) => ({
    //                     id: doc.id,
    //                     ...doc.data()
    //                 })
    //             );

    //             setUsers(usersList);

    //         } catch (error) {

    //             console.error(
    //                 "error fetching users:", error
    //             );
    //         }
    //         finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchUsers();
    // }, [])

    if (state.loading) {
        return <SPLoader />
    }

    return (
        <div className="style-stats">
            <Navbar /><div className="statistics">
                <h1>Statistics</h1>

                <div className="stats-container">

                    <div className="stat-card completed-card">
                        <h3>Completed Tasks</h3>
                        <p>{state.totalCompleted}</p>
                    </div>

                    <div className="stat-card pending-card">
                        <h3>Pending Tasks</h3>
                        <p>{state.totalPending}</p>
                    </div>

                    <div className="stat-card">
                        <h2> Total Users : {state.totalUsers} </h2>
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