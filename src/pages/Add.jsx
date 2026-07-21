import Submit from "./Submit";
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from "../firebase";
import { auth } from "../firebase";
import * as yup from "yup";
import { Card, Button } from "react-bootstrap";

export default function AddData() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const schema = yup.object({
        task: yup.string().min(5).max(12).required("Please enter the task is required"),
        description: yup.string().min(10).max(500).required("Task description is required"),
        date: yup.string().required("Task date is requied"),
        time: yup.string().required("Task time is requied"),
        category: yup.string().oneOf(["Work", "Study", "Personal", "Shopping"],
            "Invalid Category"
        )
            .required("Category is required"),

        priority: yup.string().oneOf([
            "High", "Medium", "Low"
        ], "Select Priority")
            .required("Priority is required"),

        progress: yup.number().min(0, "Progress cant be less than 0")
            .max(100, "Progress can not exceed 100")
            .required(),

        link: yup.string().url("Enter a valid url")
            .required("Link is required")

    }

    )

    async function handleSubmit(e) {
        e.preventDefault();
        try {

            await schema.validate({
                task,
                description,
                date,
                time,
                category,
                priority,
                progress: prg,
                link
            }, {abortEarly:false},
            );

            setLoading(true);
            const docRef = await addDoc(collection(db, "tasks"), {
                task: task.trim(),
                taskLower: task.trim().toLowerCase(),
                description,
                date,
                time,
                category,
                priority,
                reminder,
                progress: prg,
                link,
                uid: auth.currentUser.uid
            });
            setLoading(false);
            setErrors({});
            alert("Task added successfully!");
            console.log("Document ID:", docRef.id);
        } catch (error) {
            if(error instanceof yup.ValidationError){
                const newErrors = {};

                error.inner.forEach((err)=>{
                    newErrors[err.path] = err.message
            });
            setErrors(newErrors);
            console.log(newErrors);
            }
            else{
                console.log("error adding doc");
            }
        }
    }


    const [task, setTask] = useState("");
    const [description, setDesc] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [category, setCat] = useState("Work");
    const [priority, setPrty] = useState("");
    const [reminder, setRem] = useState(false);
    const [prg, setPrg] = useState(0);
    const [link, setLink] = useState("");



    // const newTask = {
    //     id: Date.now(),
    //     task,
    //     description,
    //     date,
    //     time,
    //     category,
    //     priority,
    //     reminder,
    //     progress: prg,
    //     link
    // }

    if (loading) {
        return <h1>Adding your Task...</h1>
    }

    return (
        <div className="d-flex justify-content-center align-items-center color-dark text-white vh:100">
            {/* <Card className="p-4 shadow" style={{width: "500px" , backgroundColor: "rgb(189, 174, 174)"}}> */}
            <h2>Add New Tasks</h2>

            <form id="todofrm" className="card my-card"
                style={{ backgroundColor: "rgb(189, 174, 174)", width: "400px" }}
                onSubmit={handleSubmit}>

                <label htmlFor="task">Task:</label><br />
                <input type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Enter the task" id="task" />
                    {errors.task && <p style={{ color: "red" }}>{errors.task}</p>}
                <br /><br />

                <label htmlFor="description">Description:</label><br />
                <textarea id="description"
                    value={description}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Write task details"></textarea>
                    {errors.description && <p style={{ color: "red" }}>{errors.description}</p>}
                <br /><br />

                <label htmlFor="date">Task Date:</label><br />
                <input type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    id="date" />
                    {errors.date && <p style={{ color: "red" }}>{errors.date}</p>}
                <br /><br />

                <label htmlFor="time">Start Time:</label><br />
                <input type="time"
                    value={time}
                    onChange={(e) => {
                        setTime(e.target.value);
                        console.log("Selected time:", e.target.value);
                    }}
                    id="time" />
                    {errors.time && <p style={{ color: "red" }}>{errors.time}</p>}
                   <br /><br /> 

                <label htmlFor="category">Category:</label><br />
                <select id="category"
                    value={category}
                    onChange={(e) => setCat(e.target.value)}
                >
                    <option>Work</option>
                    <option>Study</option>
                    <option>Personal</option>
                    <option>Shopping</option>
                </select>
                {errors.category && <p style={{ color: "red" }}>{errors.category}</p>}
                <br /><br />

                <label>Priority:</label><br />
                <input type="radio" name="priority" value="High"
                    checked = {priority === "High"}
                    onChange={(e) => setPrty(e.target.value)}
                /> High
                <input type="radio" name="priority" value="Medium"
                    checked = {priority === "Medium"}
                    onChange={(e) => setPrty(e.target.value)}
                /> Medium
                <input type="radio" name="priority" value="Low"
                    checked = {priority === "Low"}
                    onChange={(e) => setPrty(e.target.value)}
                />
                Low
                {errors.priority && <p style={{ color: "red" }}>{errors.priority}</p>}
                <br /><br />

                <label htmlFor="reminder">Reminder:</label><br />
                <input type="checkbox" id="reminder"
                    checked={reminder}
                    onChange={(e) => setRem(e.target.checked)} />

                <label htmlFor="reminder"> Enable reminder</label>
                <br /><br />

                <label htmlFor="progress">Progress:</label><br />
                <input type="range"
                    value={prg}
                    onChange={(e) => setPrg(Number(e.target.value))}
                    id="progress" min="0" max="100" />
                    {errors.progress && <p style={{ color: "red" }}>{errors.progress}</p>}
                <br /><br />

                <label htmlFor="link">Related Link:</label><br />
                <input type="url" id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https:example.com" />
                    {errors.link && <p style={{ color: "red" }}>{errors.link}</p>}
                <br /><br />

                <Submit />

            </form>
            {/* </Card> */}
        </div>);
}




