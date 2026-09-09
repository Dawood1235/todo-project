export default function ShowModal({ editTask, setEditTask, onSave, onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal">
                
                <form onSubmit={onSave}>

                    <div className="modal-header">
                        <h5 className="modal-title">Edit Task</h5>
                    </div>

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

                        {/* <textarea
                            className="form-control mb-3"
                            placeholder="Description"
                            value={editTask.description}
                            onChange={(e) =>
                                setEditTask({
                                    ...editTask,
                                    description: e.target.value
                                })
                            }
                        /> */}

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
                    
                    <div className="mb-3">
                        <label>Status</label>
                        <select
                            className = "formcontrol"
                            value={editTask.status || "Pending"}
                            onChange={(e)=>
                                setEditTask({
                                    ...editTask,
                                    status: e.target.value
                                })
                            }
                        >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="modal-footer">

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
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
    );
}