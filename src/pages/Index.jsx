import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { count, endAt, getCountFromServer, queryEqual } from 'firebase/firestore';
import { db } from "../firebase";
import { updateDoc, startAt, deleteDoc, doc } from "firebase/firestore";
import { auth } from "../firebase";
import { reauthenticateWithCredential, signOut } from "firebase/auth";

import { collection, query, where, orderBy, limit, getDocs, startAfter } from "firebase/firestore";

import { Link } from 'react-router-dom';
import SPLoader from './Loader';

export default function Homepage() {
    // 1. Manage tasks and pagination states
    const [tasks, setTasks] = useState([]);

    const [lastDoc, setLastDoc] = useState(null);

    const [loading, setLoading] = useState(false);


    const [filteredtasks, setFilteredTasks] = useState([]);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageCursors, setPageCursors] = useState([null]);

    const [totalTasks, setTotalTasks] = useState(0);

    const navigate = useNavigate();
    const page_size = 5;

    const fetchTasks = async (searchText = "", cursor = null) => {
        setLoading(true);
        try {

            let q = "";

            if (searchText === "") {
                q = query(
                    collection(db, "tasks"),
                    where("uid", "==", auth.currentUser.uid),
                    orderBy("task"),
                    limit(page_size)
                );
            }
            else {
                q = query(
                    collection(db, "tasks"),
                    where("uid", "==", auth.currentUser.uid),
                    orderBy("task"),
                    startAt(searchText),
                    endAt(searchText + "\uf8ff"),
                    limit(page_size)
                );
            }
            if (cursor) {
                if (searchText === "") {
                    q = query(
                        collection(db, "tasks"),
                        where("uid", "==", auth.currentUser.uid),
                        orderBy("task"),
                        startAfter(cursor),
                        limit(page_size)
                    );
                } else {
                    q = query(
                        collection(db, "tasks"),
                        where("uid", "==", auth.currentUser.uid),
                        orderBy("task"),
                        startAt(searchText),
                        endAt(searchText + "\uf8ff"),
                        startAfter(cursor),
                        limit(page_size)
                    )
                }
            }
        console.log("Current User UID:", auth.currentUser?.uid);
        const snapshot = await getDocs(q);

        console.log("Documents found:", snapshot.size);

        snapshot.forEach(doc => {
            console.log(doc.id, doc.data());
        });

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
        } catch(error){
            console.log(error);
        } finally {
                setLoading(false);
            }
        };

   
    useEffect(() => {
        const delay = setTimeout(() => {
            setCurrentPage(1);
            setPageCursors([null]);
            setLastDoc(null);

            let countQuery = query(collection(db,"tasks"),  
            where("uid","==",auth.currentUser.uid)
        );
            if(search!==""){
                countQuery = query(
                    collection(db,"tasks"),
                    where("uid","==",auth.currentUser.uid),
                    orderBy("task"),
                    startAt(search),
                    endAt(search + "\uf8ff")
                );
            }
        const getTaskCount = async () => {

            try{
                const countSnapshot = await getCountFromServer(countQuery);
                setTotalTasks(countSnapshot.data().count);
            }
            catch(error){
                console.error("Error getting count: ", error);
            }
        };
            getTaskCount();
            fetchTasks(search);

        }, 300)

        return () => clearTimeout(delay);
    }, [search]);

    let count_pages = 0;
    if(totalTasks%5!=0 && totalTasks>5){
        count_pages = Math.floor(totalTasks/5)+1;
    }
    else if(totalTasks%5==0 && totalTasks>5)
        {
            count_pages = Math.floor(totalTasks/5);
        }
    else if(totalTasks>=0 && totalTasks<=5){
            count_pages = 1;
        }

    const nextPage = async () => {

        if (!lastDoc) return;

        if(currentPage >= count_pages) return;

        const cursor = lastDoc;

        await fetchTasks(search, cursor);

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

        await fetchTasks(search, previousCursor);

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

    async function handleEdit(id) {
        const newTask = prompt("Enter the task");

        if (!newTask) return;

        try {
            await updateDoc(doc(db, "tasks", id), {
                task: newTask,
            });

            fetchTasks(search);

        } catch (error) {
            console.error("Error updating tasks", error);
        }
    }

    const handleLogout = async () => {

        await signOut(auth);

        navigate("/Signin");

    };

    return (
        <div className="homepage">
            <h1>Your Tasks</h1>
            {loading && <SPLoader />}
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
            {
                tasks.map((task) => (
                    <div id="tsklst" key={task.id}>
                        <h3>Task: {task.task}</h3>
                        <p>Description: {task.description}</p>
                        <p>Date: {task.date}</p>
                        <p>Time: {task.time}</p>
                        <p>Category: {task.category}</p>
                        <p>Priority: {task.priority}</p>
                        <p>Progress: {task.progress}%</p>
                        <p>Link: {task.link}</p>
                        <div id="tskbtns">
                            <button onClick={() => handleEdit(task.id)}>
                                Edit
                            </button>
                            <button onClick={() => handledelete(task.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))

            }
            <div className="btns">
                <button onClick={previousPage}>
                    Previous
                </button>

                {Array.from({length: count_pages}).map((_,index) => (
                    <button
                        key={index}
                        onClick={() => goToPage(index)}
                        className={currentPage === index + 1 ? "active" : ""}
                    >
                        {index + 1}
                    </button>
                ))}


                <button onClick={nextPage}
                    disabled={!lastDoc || currentPage>=count_pages}>
                    Next
                </button>
                <div className='hlogout1'>
                    <button onClick={handleLogout}> Logout </button>
                </div>
            </div>
        </div >
    );
}
