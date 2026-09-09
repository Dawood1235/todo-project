import Submit from "./Submit";
import { useState,useEffect } from 'react';
// import { addDoc, collection } from 'firebase/firestore';
// import { db } from "../firebase";
// import { auth } from "../firebase";
import * as yup from "yup";
// import { serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import SPLoader from "./Loader"; 
import Navbar from "../Navbar-2";
import { Card, Button } from "react-bootstrap";
import axios from "axios";

export default function AddData() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
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
                link,
                status: "Pending",
            }, {abortEarly:false});

            setLoading(true);
      
    const data = {task,description,date,time,category,priority,reminder,progress:prg,link,status:"Pending"};
    console.log("DATA BEING SENT:", data);

    const token = localStorage.getItem("token");

    const resp = await axios.post("http://localhost:5000/api/tasks", data,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    console.log("Backend response:", resp.data);

} catch(error){
            if (error instanceof yup.ValidationError) {
            const newErrors = {};

            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });

            setErrors(newErrors);
            console.log(newErrors);
        } else {
            console.error("Axios error:", error);
        }
    }
    finally{
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }
}

    //         setLoading(true);
    //         const docRef = await addDoc(collection(db, "tasks"), {
    //             task: task.trim(),
    //             taskLower: task.trim().toLowerCase(),
    //             description,
    //             date,
    //             time,
    //             category,
    //             priority,
    //             reminder,
    //             progress: prg,
    //             link,
    //             uid: auth.currentUser.uid,
    //             status: "Pending",

    //             createdAt: serverTimestamp()
    //         });
    //         setLoading(false);
    //         setErrors({});
    //         alert("Task added successfully!");
    //         navigate("/");
    //         console.log("Document ID:", docRef.id);
    //     } catch (error) {
    //         if(error instanceof yup.ValidationError){
    //             const newErrors = {};

    //             error.inner.forEach((err)=>{
    //                 newErrors[err.path] = err.message
    //         });
    //         setErrors(newErrors);
    //         console.log(newErrors);
    //         }
    //         else{
    //             console.log("error adding doc");
    //         }
    //     }
    // }


    const [task, setTask] = useState("");
    const [description, setDesc] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [category, setCat] = useState("Work");
    const [priority, setPrty] = useState("");
    const [reminder, setRem] = useState(false);
    const [prg, setPrg] = useState(0);
    const [link, setLink] = useState("");

    useEffect(() => {
    const timer = setTimeout(()=>{
    setPageLoading(false);
    } ,1000);
    return ()=> clearTimeout(timer);
    }, []);

    if(pageLoading){
        return <SPLoader />
    }



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


    return (
        <div>
            <Navbar/>
            <div className="d-flex flex-column align-items-center color-blue vh:100" style={{backgroundColor:"#0D0F1A"}}>
            {/* <Card className="p-4 shadow" style={{width: "500px" , backgroundColor: "rgb(189, 174, 174)"}}> */}
            <h2 style={{color: "white", marginTop:"20px", marginBottom: "20px"}}>Add New Tasks</h2>

            <form id="todofrm" className="card my-card p-4 mb-4"
                style={{color:"white",
                    backgroundColor: "#151824", width: "400px" }}
                onSubmit={handleSubmit}>

                <label htmlFor="task">Task:</label><br />
                <input type="text"
                    className={`form-control ${task ?"border-primary-shadow": ""}`}
                    value={task}
                    onChange={(e) =>{ setTask(e.target.value);
                        setErrors((prev)=> ({ ...prev, task:""}));
                    }}
                    placeholder="Enter the task" id="task" />
                    {errors.task && <p style={{ color: "red" }}>{errors.task}</p>}
                <br /><br />

                <label htmlFor="description">Description:</label><br />
                <textarea id="description"
                    className={`form-control ${task ?"border-primary-shadow": ""}`}
                    value={description}
                    onChange={(e) => {setDesc(e.target.value);
                             setErrors((prev)=> ({ ...prev, description:""}));
                    }}
                    placeholder="Write task details"></textarea>
                    {errors.description && <p style={{ color: "red" }}>{errors.description}</p>}
                <br /><br />

                <label htmlFor="date">Task Date:</label><br />
                <input type="date"
                    className={`form-control ${task ?"border-primary-shadow": ""}`}
                    value={date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {setDate(e.target.value);
                            setErrors((prev)=> ({ ...prev, date:""}));
                    }}
                    id="date" />
                    {errors.date && <p style={{ color: "red" }}>{errors.date}</p>}
                <br /><br />

                <label htmlFor="time">Start Time:</label><br />
                <input type="time"
                    className={`form-control ${task ?"border-primary-shadow": ""}`}
                    value={time}
                    onChange={(e) => {
                        setTime(e.target.value);
                        setErrors((prev)=> ({ ...prev, time:""}));
                    }}
                    id="time" />
                    {errors.time && <p style={{ color: "red" }}>{errors.time}</p>}
                   <br /><br /> 

                <label htmlFor="category">Category:</label><br />
                <select id="category"
                    value={category}
                    onChange={(e) => {setCat(e.target.value);
                                    setErrors((prev)=> ({ ...prev, category:""}));
                    }}
                >
                    <option>Work</option>
                    <option>Study</option>
                    <option>Personal</option>
                    <option>Shopping</option>
                </select>
                {errors.category && <p style={{ color: "red" }}>{errors.category}</p>}
                <br /><br />

                <label>Priority:</label><br />
                <div className="priority-option">
                    <label>
                        <input type="radio" 
                            name="priority"
                            value="High"
                            checked = {priority === "High"}
                            onChange={(e) => {setPrty(e.target.value);
                                          setErrors((prev)=> ({ ...prev, priority:""}));

                            }}
                        /> High
                    </label>
                </div>
                <div className="priority-option">
                    <label>
                        <input type="radio" 
                            name="priority"
                            value="Medium"
                            checked = {priority === "Medium"}
                            onChange={(e) =>{ setPrty(e.target.value)
                                         setErrors((prev)=> ({ ...prev, priority:""}));
                            }}
                        /> Medium
                    </label>
                </div>
                <div className="priority-option">
                    <label>
                        <input type="radio" 
                            name="priority"
                            value="Low"
                            checked = {priority === "Low"}
                            onChange={(e) =>{ setPrty(e.target.value);
                                     setErrors((prev)=> ({ ...prev, priority:""}));
                            }}
                        /> Low
                    </label>
                </div>
                {errors.priority && <p style={{ color: "red" }}>{errors.priority}</p>}
                <br /><br />

                <label>Reminder:</label><br />
                <div className="rem-opt">
                    <label>
                        <input 
                            type="checkbox" id="reminder"
                            checked={reminder}
                            onChange={(e) => {setRem(e.target.checked);
                                    setErrors((prev)=> ({ ...prev, reminder:""}));

                            }}
                            />
                            Enable Reminder
                    </label>
                </div>
                <br /><br />

                <label htmlFor="progress">Progress:</label><br />
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="range"
                    value={prg}
                    onChange={(e) => {setPrg(Number(e.target.value))
                            setErrors((prev)=> ({ ...prev, progress:""}));
                    }}
                    id="progress" min="0" max="100" />
                    
                    <span style = {{color: "white", minwidth: "45px"}}>
                        {prg}%
                    </span>
                  </div>
                    {errors.progress && <p style={{ color: "red" }}>{errors.progress}</p>}
                <br /><br />

                <label htmlFor="link">Related Link:</label><br />
                <input type="url" id="link"
                    className={`form-control ${task ?"border-primary-shadow": ""}`}
                    value={link}
                    onChange={(e) => {setLink(e.target.value)
                         setErrors((prev)=> ({ ...prev, link:""}));
                    }}
                    
                    placeholder="https:example.com" />
                    {errors.link && <p style={{ color: "red" }}>{errors.link}</p>}
                <br /><br />

                    <Submit loading={loading} />


            </form>
            {/* </Card> */}
        </div>
    </div>);
}

