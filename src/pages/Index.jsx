import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { count, endAt, getCountFromServer, queryEqual } from 'firebase/firestore';
import { db } from "../firebase";
import { updateDoc, startAt, deleteDoc, doc } from "firebase/firestore";
import { auth } from "../firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { reauthenticateWithCredential, signOut } from "firebase/auth";

import { collection, query, where, orderBy, limit, getDocs, startAfter } from "firebase/firestore";

import { Link } from 'react-router-dom';
import SPLoader from './Loader';

export default function Homepage() {
    // 1. Manage tasks and pagination states

    const [showModal, setShowModal] = useState(false);

    const [editTask, setEditTask] = useState({
        id: "",
        task: "",
        description: "",
        date: "",
        time: "",
        category: "",
        priority: "",
        progress: "",
        link: ""
    });

    const [tasks, setTasks] = useState([]);

    const [lastDoc, setLastDoc] = useState(null);

    const [loading, setLoading] = useState(true);


    const [filteredtasks, setFilteredTasks] = useState([]);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageCursors, setPageCursors] = useState([null]);

    const [totalTasks, setTotalTasks] = useState(0);

    const navigate = useNavigate();
    const page_size = 6;

    const fetchTasks = async (user, searchText = "", cursor = null) => {
        searchText = searchText.trim().toLowerCase();
        try {

            let q = "";

            if (searchText === "") {
                q = query(
                    collection(db, "tasks"),
                    where("uid", "==", user.uid),
                    orderBy("createdAt", "desc"),
                    limit(page_size)
                );
            }
            else {
                q = query(
                    collection(db, "tasks"),
                    where("uid", "==", user.uid),
                    orderBy("taskLower"),
                    startAt(searchText),
                    endAt(searchText + "\uf8ff"),
                    limit(page_size)
                );
            }
            if (cursor) {
                if (searchText === "") {
                    q = query(
                        collection(db, "tasks"),
                        where("uid", "==", user.uid),
                        orderBy("createdAt", "desc"),
                        startAfter(cursor),
                        limit(page_size)
                    );
                } else {
                    q = query(
                        collection(db, "tasks"),
                        where("uid", "==", user.uid),
                        orderBy("taskLower"),
                        startAt(searchText),
                        endAt(searchText + "\uf8ff"),
                        startAfter(cursor),
                        limit(page_size)
                    )
                }
            }
            console.log("Search text:", searchText);

            console.log("Current User UID:", auth.currentUser?.uid);
            const snapshot = await getDocs(q);

            console.log("Documents found:", snapshot.size);

            snapshot.docs.forEach(doc => {
                console.table(doc.data());
            });

            // snapshot.forEach(doc => {
            //     console.log(JSON.stringify(doc.data(), null, 2));
            // });

            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            setTasks(list);

            if (snapshot.docs.length > 0) {
                setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
            }
            else {
                setLastDoc(null);
            }
        } catch (error) {
            console.log(error);
        } finally {
            console.log("loading done");
            setLoading(false);
        }
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {

            if (!user) {
                console.log("No user is logged in");
                setLoading(false);
                return;
            }
            const delay = setTimeout(() => {
                setCurrentPage(1);
                setPageCursors([null]);
                setLastDoc(null);

                let countQuery = query(
                    collection(db, "tasks"),
                    where("uid", "==", user.uid)
                );

                if (search.trim() !== "") {
                    const searchText = search.trim().toLowerCase();

                    countQuery = query(
                        collection(db, "tasks"),
                        where("uid", "==", user.uid),
                        orderBy("taskLower"),
                        startAt(searchText),
                        endAt(searchText + "\uf8ff")
                    );
                }

                const getTaskCount = async () => {
                    try {
                        const countSnapshot = await getCountFromServer(countQuery);
                        setTotalTasks(countSnapshot.data().count);
                    } catch (error) {
                        console.error("Error getting count:", error);
                    }
                };

                const loadData = async () => {
                    console.log("Loading began");
                    console.log("Current User UID:", user.uid);

                    await getTaskCount();
                    await fetchTasks(user, search);

                    console.log("Loading finished");
                    setLoading(false);
                };

                loadData();

            }, 300);

            return () => clearTimeout(delay);
        });

        return () => unsubscribe();

    }, [search]);


    let count_pages = 0;
    if (totalTasks % 6 != 0 && totalTasks > 6) {
        count_pages = Math.floor(totalTasks / 6) + 1;
    }
    else if (totalTasks % 6 == 0 && totalTasks > 6) {
        count_pages = Math.floor(totalTasks / 6);
    }
    else if (totalTasks >= 0 && totalTasks <= 6) {
        count_pages = 1;
    }

    const nextPage = async () => {

        if (!lastDoc) return;

        if (currentPage >= count_pages) return;

        const cursor = lastDoc;

        await fetchTasks(auth.currentUser, search, cursor);

        setPageCursors(prev => [...prev, cursor]);
        setCurrentPage(prev => prev + 1);

    };

    const previousPage = async () => {
        if (currentPage === 1) return;

        const newCursors = [...pageCursors];

        newCursors.pop();

        setPageCursors(newCursors);

        const previousCursor = newCursors[newCursors.length - 1];

        setCurrentPage(prev => prev - 1);

        await fetchTasks(auth.currentUser, search, previousCursor);

    }



    // const PrevPage = () => {
    //     const prevDoc = history[currentPage - 2];

    //     if(prevDoc || currentPage === 2){
    //         const newTasks = 
    //     }
    // };

    // async function fetchtasks() {
    //     const querySnapshot = await getDocs(collection(db, "tasks"));

    //     const taskList = querySnapshot.docs.map((doc) => ({
    //         id: doc.id,
    //         ...doc.data()
    //     }))
    //     setTasks(taskList);
    //     setFilteredTasks(taskList);
    // }

    // useEffect(() => {
    //     const filtered = tasks.filter((item)=>
    //     item.task.toLowerCase().includes(search.toLowerCase().trim())
    //     );
    //     setFilteredTasks(filtered);
    // }, [search, tasks]);

    async function handledelete(id) {
        try {
            await deleteDoc(doc(db, "tasks", id));
            fetchTasks(search);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    function handleEdit(task) {
        setEditTask({
            id: task.id,
            task: task.task || "",
            description: task.description || "",
            date: task.date || "",
            time: task.time || "",
            category: task.category || "",
            priority: task.priority || "",
            progress: task.progress || "",
            link: task.link || "",
        });
        setShowModal(true);
    }

    async function handleUpdate(e) {
        e.preventDefault();

        try {
            await updateDoc(doc(db, "tasks", editTask.id), {
                task: editTask.task || "",
                description: editTask.description || "",
                date: editTask.date || "",
                time: editTask.time || "",
                category: editTask.category || "",
                priority: editTask.priority || "",
                progress: editTask.progress || "",
                link: editTask.link || "",
            });
            setShowModal(false);

            await fetchTasks(auth.currentUser, search);
        } catch (error) {
            console.error("Error updating task", error);
        }
    }

    // async function handleEdit(id) {
    //     const newTask = prompt("Enter the task");

    //     if (!newTask) return;

    //     try {
    //         await updateDoc(doc(db, "tasks", id), {
    //             task: newTask,
    //             taskLower: newTask.trim().toLowerCase(),
    //         });

    //         fetchTasks(search);

    //     } catch (error) {
    //         console.error("Error updating tasks", error);
    //     }
    // }

    const handleLogout = async () => {

        await signOut(auth);

        navigate("/Signin");

    };
    console.log("page loading");
    if (loading) {
        // return <h1 style={{ color: "red" }}>LOADING...</h1>;
        return <SPLoader />
    }

    return (
        <div className="homepage">
            <h1>Your Tasks</h1>

            <div id="adtbtn">
                <input type="text" placeholder="Enter the task to search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} />
                <Link to="/pages/Add">
                    <button id="adtsk">
                        Add Tasks
                    </button>
                </Link>
            </div>


            {/* if(input.value == title.toLower.trim()){} */}
            {/* filter(title.toLower.trim() || description.tolower.trim()) */}
            
                {/* <div className='card' style={{width: '18rem'}}> */}
        <div className="container py-5">
            <div className="row g-4 justify-content-center">
            {    tasks.map((task) => (
                    <div className="col-12 col-sm-6 col-md-4" key={task.id}>
                        <div className="card-body p-4 text-black rounded-5 h-100" style={{backgroundColor: '#51DBC1'}}>
                    {/* // <div id="tsklst" key={task.id}> */}
                        <h3>Task: {task.task}</h3>
                        <p>Description: {task.description}</p>
                        <p>Date: {task.date}</p>
                        <p>Time: {task.time}</p>
                        <p>Category: {task.category}</p>
                        <p>Priority: {task.priority}</p>
                        <p>Progress: {task.progress}%</p>
                        <p>Link: {task.link}</p>
                        <div id="tskbtns">
                            <button onClick={() => handleEdit(task)}>
                                Edit
                            </button>
                            <button onClick={() => handledelete(task.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                ))

            }
            </div>
         </div>

            
            {showModal && (
                <div
                    className="modal fade show d-block "
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg rounded-4 p-2">

                            <div className="modal-header border-0 pb-0" style={{backgroundColor: '#3B71CA', display:'flex', alignItems:'center', height:'60px', padding:'0 1rem'}}>
                                <h5 className="modal-title fw-bold text-dark fs-4 m-0 w-100">Edit Task</h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>

                            <form onSubmit={handleUpdate}>

                                <div className="modal-body py-3">

                                    <input
                                        className="form-control mb-3"
                                        placeholder="Task"
                                        value={editTask.task}
                                        onChange={(e) =>
                                            setEditTask({
                                                ...editTask,
                                                task: e.target.value
                                            })
                                        }
                                    />

                                    <textarea
                                        className="form-control mb-3"
                                        placeholder="Description"
                                        value={editTask.description}
                                        onChange={(e) =>
                                            setEditTask({
                                                ...editTask,
                                                description: e.target.value
                                            })
                                        }
                                    />

                                    <input
                                        type="date"
                                        className="form-control mb-3"
                                        value={editTask.date}
                                        onChange={(e) =>
                                            setEditTask({
                                                ...editTask,
                                                date: e.target.value
                                            })
                                        }
                                    />

                                    <input
                                        type="time"
                                        className="form-control mb-3"
                                        value={editTask.time}
                                        onChange={(e) =>
                                            setEditTask({
                                                ...editTask,
                                                time: e.target.value
                                            })
                                        }
                                    />

                                    <input
                                        className="form-control mb-3"
                                        placeholder="Category"
                                        value={editTask.category}
                                        onChange={(e) =>
                                            setEditTask({
                                                ...editTask,
                                                category: e.target.value
                                            })
                                        }
                                    />

                                    <select
                                        className="form-select mb-3"
                                        value={editTask.priority}
                                        onChange={(e) =>
                                            setEditTask({
                                                ...editTask,
                                                priority: e.target.value
                                            })
                                        }
                                    >
                                        <option value="">Select Priority</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>

                                    <input
                                        type="number"
                                        className="form-control mb-3"
                                        min="0"
                                        max="100"
                                        placeholder="Progress"
                                        value={editTask.progress}
                                        onChange={(e) =>
                                            setEditTask({
                                                ...editTask,
                                                progress: e.target.value
                                            })
                                        }
                                    />

                                    <input
                                        type="url"
                                        className="form-control"
                                        placeholder="Link"
                                        value={editTask.link}
                                        onChange={(e) =>
                                            setEditTask({
                                                ...editTask,
                                                link: e.target.value
                                            })
                                        }
                                    />

                                </div>

                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Save Changes
                                    </button>

                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            )}
            <div className="btns">
                <button onClick={previousPage}>
                    Previous
                </button>

                {Array.from({ length: count_pages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToPage(index)}
                        className={currentPage === index + 1 ? "active" : ""}
                    >
                        {index + 1}
                    </button>
                ))}


                <button onClick={nextPage}
                    disabled={!lastDoc || currentPage >= count_pages}>
                    Next
                </button>
                <div className='hlogout1'>
                    <button onClick={handleLogout}> Logout </button>
                </div>
            </div>
        </div >
    );
}
