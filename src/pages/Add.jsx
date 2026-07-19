import Submit from "./Submit";
import { useState } from 'react';
import {addDoc, collection } from 'firebase/firestore';
import { db } from "../firebase";
import { auth } from "../firebase";
import { Card, Button } from "react-bootstrap";

export default function AddData() {

   async function handleSubmit(e){
    e.preventDefault();
     try{
        const docRef = await addDoc(collection(db, "tasks"),{
            task,
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
    alert("Task added successfully!");
        console.log("Document ID:", docRef.id);
    } catch(error) {
        console.error("Error adding document:", error);
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
    const [link, setLnk] = useState("");

    

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
         <div className="d-flex justify-content-center align-items-center color-dark text-white vh:100">
            {/* <Card className="p-4 shadow" style={{width: "500px" , backgroundColor: "rgb(189, 174, 174)"}}> */}
                <h2>Add New Tasks</h2>

           <form id="todofrm" className="card my-card"        
            style={{ backgroundColor: "rgb(189, 174, 174)", width: "400px" }}
            onSubmit={handleSubmit}>

               <label htmlFor="task">Task:</label><br />
              <input type="text"
                 value={task}
                    onChange={(e)=> setTask(e.target.value)}
                   placeholder="Enter the task" id="task" required /><br /><br />

               <label htmlFor="description">Description:</label><br />
                <textarea id="description"
                value={description}
                onChange={(e)=> setDesc(e.target.value)} 
                placeholder="Write task details" required></textarea><br /><br />

                <label htmlFor="date">Task Date:</label><br />
                <input type="date"
                    value={date}
                    onChange={(e)=> setDate(e.target.value)}
                    id="date" required /><br /><br />

                <label htmlFor="time">Start Time:</label><br />
                <input type="time"
                    value={time}
                    onChange={(e)=> setTime(e.target.value)}
                    id="time" required /><br /><br />

             <label htmlFor="category">Category:</label><br />
                 <select id="category" 
                 value={category}
                 onChange={(e)=>setCat(e.target.value)}
                 required>
                    <option>Work</option>
                     <option>Study</option>
                     <option>Personal</option>
                     <option>Shopping</option>
                 </select><br /><br />

                 <label>Priority:</label><br />
                 <input type="radio" name="priority" value="High"
                onChange={(e)=>setPrty(e.target.value)}
                 required /> High
                 <input type="radio" name="priority" value="Medium" 
                 onChange={(e)=>setPrty(e.target.value)}
                 /> Medium
                 <input type="radio" name="priority" value="Low" 
                onChange={(e)=>setPrty(e.target.value)}
                 /> Low
                 <br /><br />

                 <label htmlFor="reminder">Reminder:</label><br />
                 <input type="checkbox" id="reminder"
                 checked={reminder}
                 onChange={(e)=>setRem(e.target.value)} 
                 required />
                 Enable reminder
                 <br /><br />

                 <label htmlFor="progress">Progress:</label><br />
                 <input type="range"
                     value={prg}
                     onChange={(e)=> setPrg(e.target.value)} 
                     id="progress" min="0" max="100" required />
                 <br /><br />

                 <label htmlFor="link">Related Link:</label><br />
                 <input type="url" id="link" 
                 value={link}
                 onChange={(e)=>setLnk(e.target.value)}
                 placeholder="https:example.com" required />
                 <br /><br /> 

               <Submit />

            </form>
            {/* </Card> */}
         </div>);
}




