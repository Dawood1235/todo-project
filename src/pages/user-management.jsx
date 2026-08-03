import { collection, query, where, getDocs, doc, deleteDoc, updateDoc, orderBy, startAt, endAt } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import SPLoader from "./Loader";
import Navbar from "../Navbar";
import ShowModal from "../ShowModal";

export default function UserManagement() {

    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 10;

    async function handlestatuschange(id,newStatus){
        try{
            await updateDoc(doc(db,"tasks",id),{
                status: newStatus
    });

    setData((prevData)=>
        prevData.map((item) =>
            item.id === id? {...item, status:newStatus}:item)
        );
    }
    catch(error){
        console.log(error);
        alert("ERROR UPDATING");
        }
    }
    function handleEdit(item) {
        console.log("called handle");
        setEditTask(item);
        setShowModal(true);
    }

    const searchTasks = async (searchText) => {
        console.log("3. Search Called:");
        try {
            const text = searchText.trim().toLowerCase();

            console.log("3. Processed search:", text);


            if (!text) {
                console.log("Seach is empty");
                return;
            }

            console.log("5. Current user:", auth.currentUser);
            console.log("6. Current user UID:", auth.currentUser?.uid);

            const q = query(
                collection(db, "tasks"),
                // where("uid","==",auth.currentUser.uid),
                orderBy("taskLower"),
                startAt(text),
                endAt(text + "\uf8ff")
            );

            console.log("7. Firebase query created");

            const snapshot = await getDocs(q);

            console.log("8. Firebase query completed");
            console.log("9. Number of results:", snapshot.size);

            const results = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log("10. Search results:", results);

            results.forEach((item) => {
                console.log(
                    "Task:",
                    item.task,
                    "| taskLower:",
                    item.taskLower
                );
            });


            setData(results);
            setCurrentPage(1);

        } catch (error) {
            console.error("Error searching tasks:", error);
        }
        finally {
            console.log("11. Search finished");
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("Search changed:", search);

        if (search.trim() === "") {
            console.log("Empty search → fetching all tasks");
            setLoading(true);
            fetchData();
        } else {
            console.log("Searching Firebase for:", search);
            searchTasks(search);
        }
    }, [search]);

    async function handleUpdate(e) {
        e.preventDefault();

        try {
            await updateDoc(doc(db, "tasks", editTask.id), {
                task: editTask.task,
                taskLower: editTask.task,
                description: editTask.description,
                date: editTask.date,
                time: editTask.time,
                category: editTask.category,
                priority: editTask.priority,
                link: editTask.link,
            });

            setData((prevData) =>
                prevData.map((item) =>
                    item.id === editTask.id ? editTask : item
                )
            );
            setShowModal(false);
            setEditTask(null);
        } catch (error) {
            console.log(error);
            alert("Error checking tasks");
        }
    }

    async function handleDelete(id) {
        try {
            await deleteDoc(doc(db, "tasks", id));

            setData((prevTasks) => prevTasks.filter((task) => task.id !== id));
        }
        catch (error) {
            alert("Error deleting task");
        }
    }

    const fetchData = async () => {
        const userRefs = collection(db, "tasks");
        try {
            const querySnapshot = await getDocs(userRefs);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setData(data);
            console.log(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    // ADD THIS

    if (loading) {
        return <SPLoader />
    }

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;

    const currentTasks = data.slice(indexOfFirstTask, indexOfLastTask);

    const totalPages = Math.ceil(data.length / tasksPerPage);


    return (
        <div>
            <Navbar />
            <h1>All Tasks</h1>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search tasks"
                value={search}
                onChange={(e) => {
                    console.log("Input value:", e.target.value);
                    setSearch(e.target.value)
                    setCurrentPage(1);
                }}

            />
            <table className="styled-table">
                <tbody>
                    {
                        currentTasks.map((item, index) => {
                            return (
                                <tr className="trow" key={item.id}>
                                    <td>{item.task}</td>
                                    <td>{item.description}</td>
                                    <td>{item.date}</td>
                                    <td>{item.time}</td>
                                    <td>{item.category}</td>
                                    <td>{item.priority}</td>
                                    <td>{item.progress}</td>
                                    <td>{item.link}</td>
                                    <td>{item.status || "Pending"}</td>
                                    {/* <td><button onClick={handleEdit}>Edit</button></td> */}
                                    <td><button onClick={() => handleDelete(item.id)}>Delete</button></td>
                                    <td><button onClick={() => { console.log("clicked"); handleEdit(item) }}>Edit</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            {showModal && editTask && (
                <>
                    {console.log("SHOWING MODAL")}
                    <ShowModal
                        editTask={editTask}
                        setEditTask={setEditTask}
                        onSave={handleUpdate}
                        onClose={() => {
                            setShowModal(false);
                            setEditTask(null);
                        }}
                    />
                </>
            )}
            <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
            >Previous
            </button>

            <span>
                Page {currentPage} of {totalPages}
            </span>

            <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
            >Next
            </button>
        </div>
    );
}





