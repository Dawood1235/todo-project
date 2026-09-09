import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar-2";

export default function Details() {
    const { id } = useParams();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `http://localhost:5000/api/tasks/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setTask(response.data);
            } catch (error) {
                console.error("Error fetching task:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <>
            <Navbar />
            <div
                style={{
                    minHeight: "calc(100vh - 70px)",
                    backgroundColor: "#0D0F1A",
                    color: "white",
                    paddingTop: "1px"
                }}
            >

                <div className="container mt-5">
                    <h1>{task.task}</h1>
                    <h4>Description</h4>
                    <p className="task-description">
                        {task.description}
                    </p>
                </div>
            </div>
        </>);
}