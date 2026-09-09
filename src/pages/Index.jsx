import { useState, useEffect, useRef,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navbar-2";
import { Trash2, Edit2, ExternalLink, Clock, Calendar, Search, Plus } from "lucide-react";
import axios from "axios";
// import { subscribeToPushNotifications } from "../utils/pushNotification";

import { Link } from 'react-router-dom';
import SPLoader from './Loader';
// import {register_Push} from "../registerPush";


export default function Homepage() {

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [progressError, setProgressError] = useState("");
    const [dateError, setDateError] = useState("");
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [editTask, setEditTask] = useState({
        id: "",
        task: "",
        description: "",
        date: "",
        time: "",
        category: "",
        priority: "",
        progress: "",
        link: "",
        status: "Pending"
    });

    const [tasks, setTasks] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const remindedTasks = useRef(new Set());

    // const [lastDoc, setLastDoc] = useState(null);

    const [loading, setLoading] = useState(true);

    const [filteredtasks, setFilteredTasks] = useState([]);

    const [search, setSearch] = useState("");

    const navigate = useNavigate();
    // const page_size = 6;


    const deleteTasks = async (id) => {
        try {

            const token = localStorage.getItem("token");
            setDeletingId(id);

            await axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks`, {
                params: {
                    _id: id
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchTasks(currentPage, search);
        }
        catch (error) {
            console.error("Error deleting task:", error);
        }
        finally{
            setDeletingId(null);
        }
    }

    const fetchTasks = useCallback(async (page, searchText = "") => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`, {
                params: {
                    page: page,
                    search: searchText
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTasks(response.data.docs);
            setCurrentPage(response.data.page);
            setTotalPages(response.data.totalPages);
            console.log(page);
            console.log("GET RESPONSE FROM BACKEND:", response.data.docs);

            response.data.docs.forEach((task) => {
                console.log(
                    "TASK FROM GET:",
                    task.task,
                    "REMINDER:",
                    task.reminder
                );
            });

            setTasks(response.data.docs);
            console.log(response.data);
        }
        catch (error) {
            console.error("Error fetching tasks", error);
            console.log("Status:", error.response?.status);
            console.log("Response:", error.response?.data);
        }
        finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTasks(1, search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // const {page} = response.params;

    useEffect(() => {
        fetchTasks(currentPage, search);
    }, [currentPage]);



    const handleUpdate = async () => {
        try {

            const progress = Number(editTask.progress);


            if (progress < 0 || progress > 100) {
                setProgressError("Progress must be between 0 and 100");
                return;
            }
            console.log("UPDATE BUTTON CLICKED");
            console.log("EDIT TASK:", editTask);

            const token = localStorage.getItem("token");

            const data = {
                task: editTask.task,
                description: editTask.description,
                date: editTask.date,
                time: editTask.time,
                category: editTask.category,
                priority: editTask.priority,
                progress: editTask.progress,
                link: editTask.link,
                status: editTask.status
            }

            await axios.patch(`${import.meta.env.VITE_API_URL}/api/tasks`, { data }, {
                params: { id: editTask.id },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            await fetchTasks(currentPage, search);
            setShowModal(false);
        } catch (error) {
            console.error("Updating error:", error);
        }

    };


    const handleEdit = (task) => {
        console.log("EDIT BUTTON CLICKED");
        console.log("TASK RECEIVED:", task);

        setEditTask({
            id: task._id,
            task: task.task || "",
            description: task.description || "",
            date: task.date || "",
            time: task.time || "",
            category: task.category || "",
            priority: task.priority || "",
            progress: task.progress || "",
            link: task.link || "",
            status: task.status || "Pending"
        });
        setShowModal(true);
    }

    useEffect(() => {
        console.log("Edit task state:", editTask);
    }, [editTask])

    console.log("page loading");
    if (loading) {
        return <SPLoader />
    }

    console.log("showModal:", showModal);

    return (
        <div className="homepage">
            <Navbar
                search={search}
                setSearch={setSearch}
                setCurrentPage={setCurrentPage}
            />
            <div className='main-tsk'>
                <h1 className='tasks-hm'>Your Tasks</h1>

                {/* <div id="adtbtn"> */}
                <Link to="/pages/Add">
                    <button id="adtsk"
                        style={{ backgroundColor: "#7C5CFC", color: "white", border: 0, paddingTop: "5px", paddingBottom: "5px", borderRadius: "15px" }}
                    >
                        <Plus size={18} />
                        Add Task
                    </button>
                </Link>
            </div>


            <div className="container flex-grow-1">
                <div className="row g-4 justify-content-center">
                    {tasks.map((task) => (
                        <div className="col-12 col-sm-6 col-md-4" key={task._id}>
                            <div className={`todo-card priority-${task.priority.toLowerCase()}`}>
                                <div className="tasktop">
                                    <span className="category-chip">{task.category}</span>
                                    <span className={`priority-chip ${task.priority?.toLowerCase()}`}>
                                        <span className="priority-dot"></span>
                                        {task.priority}
                                    </span>
                                </div>
                                <h3>Task: {task.task}</h3>
                                <p className="dscr">Description: {task.description.length > 40 ? `${task.description.slice(0, 40)}...`
                                    :task.description}
                                    {task.description.length > 40 && (
                                        <span
                                            onClick={() => navigate(`/task/${task._id}`)}
                                            style={{
                                                color: "7C5CFC",
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Read More
                                        </span>
                                    )}
                                    </p>

                                <div className='time'>
                                    <p><Calendar /> {new Date(task.date).toLocaleDateString()}</p>
                                    <p><Clock /> {task.time}</p>
                                </div>
                                <div className="progress-container">
                                    <div className="progress-header">
                                        <span>{task.progress}%</span>
                                    </div>

                                    <div className='progress-bar'>
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${task.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className='icons'>
                                    <a
                                        href={task.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className='open-link'
                                    >
                                        Open Link <ExternalLink size={16} />
                                    </a>
                                    {/* <p><ExternalLink/>: {task.link}</p> */}
                                    <div className='task-set'>
                                        <button onClick={() => {
                                            setTaskToDelete(task._id);
                                            setShowDeleteModal(true);
                                        }}>
                                            <Trash2 size={20} />
                                        </button>
                                        <button onClick={() => handleEdit(task)}>
                                            <Edit2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {showDeleteModal && (
                        <div className="modal-overlay">
                            <div className="delete-modal">

                                <h4>Delete Task?</h4>

                                <p>
                                    Are you sure you want to delete the task
                                </p>

                                <div className="delete-modal-buttons">

                                    <button
                                        className='btn btn-secondary'
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setTaskToDelete(null);
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className='btn btn-danger'
                                        disabled = {deletingId === taskToDelete}
                                        onClick={async () => {
                                            await deleteTasks(taskToDelete);

                                            setShowDeleteModal(false);
                                            setTaskToDelete(null);
                                        }}
                                    >
                                        {deletingId === taskToDelete ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            </div>

                        </div>

                    )}
                    {showModal && (
                        <div
                            className="modal fade show"
                            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                            tabIndex="-1"
                        >
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content">

                                    {/* Header */}
                                    <div className="modal-header">
                                        <div>
                                            <h5 className="modal-title fw-bold">
                                                Edit Task
                                            </h5>
                                            <small className="text-muted">
                                                Update your task details
                                            </small>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setShowModal(false)}
                                        ></button>
                                    </div>

                                    {/* Body */}
                                    <div className="modal-body">

                                        <div className="row g-3">

                                            {/* Task */}
                                            <div className="col-12">
                                                <label className="form-label fw-semibold">
                                                    Task
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editTask.task}
                                                    onChange={(e) =>
                                                        setEditTask({
                                                            ...editTask,
                                                            task: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>

                                            {/* Description */}
                                            <div className="col-12">
                                                <label className="form-label fw-semibold">
                                                    Description
                                                </label>

                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    value={editTask.description}
                                                    onChange={(e) =>
                                                        setEditTask({
                                                            ...editTask,
                                                            description: e.target.value
                                                        })
                                                    }
                                                ></textarea>
                                            </div>

                                            {/* Date */}
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Date
                                                </label>

                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    min={new Date().toISOString().split("T")[0]}
                                                    value={editTask.date}
                                                    onChange={(e) =>
                                                        setEditTask({
                                                            ...editTask,
                                                            date: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>

                                            {/* Time */}
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Time
                                                </label>

                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    value={editTask.time}
                                                    onChange={(e) =>
                                                        setEditTask({
                                                            ...editTask,
                                                            time: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>

                                            {/* Category */}
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Category
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editTask.category}
                                                    onChange={(e) =>
                                                        setEditTask({
                                                            ...editTask,
                                                            category: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>

                                            {/* Priority */}
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Priority
                                                </label>

                                                <select
                                                    className="form-select"
                                                    value={editTask.priority}
                                                    onChange={(e) =>
                                                        setEditTask({
                                                            ...editTask,
                                                            priority: e.target.value
                                                        })
                                                    }
                                                >
                                                    <option value="">Select priority</option>
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="High">High</option>
                                                </select>
                                            </div>

                                            {/* Progress */}
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Progress (%)
                                                </label>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="form-control"
                                                    value={editTask.progress}
                                                    onChange={(e) => {
                                                        setEditTask({
                                                            ...editTask,
                                                            progress: e.target.value
                                                        })
                                                        setProgressError("");
                                                    }}
                                                />
                                                {progressError && (
                                                    <p className="text-danger mt-1">
                                                        {progressError}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Status */}
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Status
                                                </label>

                                                <select
                                                    className="form-select"
                                                    value={editTask.status}
                                                    onChange={(e) =>
                                                        setEditTask({
                                                            ...editTask,
                                                            status: e.target.value
                                                        })
                                                    }
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </div>

                                            {/* Link */}
                                            <div className="col-12">
                                                <label className="form-label fw-semibold">
                                                    Link
                                                </label>

                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    placeholder="https://example.com"
                                                    value={editTask.link}
                                                    onChange={(e) =>
                                                        setEditTask({
                                                            ...editTask,
                                                            link: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>

                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="modal-footer">

                                        <button
                                            type="button"
                                            className="btn btn-light border"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-primary px-4"
                                            onClick={handleUpdate}
                                        >
                                            Update Task
                                        </button>

                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {totalPages != 0 ? (
                <div
                    className='pagination'
                >
                    <button
                        className="bg-violet-600 text-white hover:bg-violet-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed px-4 py-2 rounded transition-colors"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage == 1}
                    >
                        Previous
                    </button>

                    <button
                        style={{
                            backgroundColor: "#7c3aed",
                            color: "white",
                            border: "1px solid #1CA27",
                            padding: "6px 12px",
                            borderRadius: "5px"
                        }}
                    >
                        {currentPage}
                    </button>

                    <button
                        className="bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all px-4 py-2 rounded"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage == totalPages}
                    >Next
                    </button>

                </div>
            ) : (<div className="ntasks"><h1>No tasks</h1></div>)}
        </div>
    );
}
