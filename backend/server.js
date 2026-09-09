const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const dns=require('dns');
const cors = require('cors');
const port = 5000;
const Task = require('./models/todo.js');
const todoroutes = require("./routes/todoroutes");
const authroutes = require("./routes/authroutes");
const adminroutes = require("./routes/adminroutes");
const notificationroutes = require("./routes/notificationrt");
require("./utils/reminderScheduler");

// const notificationRoutes = require("./routes/notifyroute")


console.log("AUTH ROUTES:", authroutes);


dns.setServers(["1.1.1.1","8.8.8.8"]);

const app = express();
app.use(express.json());
app.use(cors({
      origin: "http://localhost:5173"
}));



connectDB();

app.use("/api", todoroutes);
app.use("/", authroutes);
app.use("/admin", adminroutes);
app.use("/notifications",notificationroutes);


// app.use("/api", notificationRoutes);


// app.get("/new", (req, res) => {
//     res.send("backend working");
// });

// app.put("/",(req,res)=>{
//     for(tasks._id in tid){
//         if(tid === req.body.tasks._id){
//             tasks[tasks._id] = req.body.task;
//             description[tasks._id] = req.body.description;
//             date[tasks._id] = req.body.date;
//             time[tasks._id] = req.body.time;
//             category[tasks._id] = req.body.category;
//             priority[tasks._id] = req.body.priority;
//             link[tasks._id] = req.body.link;
//         }
//     }
// })
// app.post("/new",async(req,res)=>{
//     try{
//         const tasks = new Task({
//             task: req.body.task,
//             description: req.body.description,
//             date: req.body.date,
//             time: req.body.time,
//             category: req.body.category,
//             priority: req.body.priority,
//             progress: req.body.progress,
//             link: req.body.link,
//             status: "Pending"
//         });


//     const savedTask = await tasks.save();

//     console.log("Task Saved");

//     res.json(savedTask);
//     } catch(error){
//         console.error("ERROR:", error);
//         res.status(500).json({error: error.message});
//     }
//     // console.log("BODY:", req.body);
// });

// app.get("/new",(req,res)=>{
//     res.send("Backend is working now");
// });

// app.get("/new", (req, res) => {
//     res.send("GET /new is working");
// });

app.listen(port,()=>{
    console.log("Server running http://localhost:5000");
});


// const express = require("express");
// // const cors = require("cors");

// const app = express();

// // app.use(cors());
// app.use(express.json());

// app.get("/test", (req, res) => {
//     res.send("Backend is working!");
// });

// app.post("/new", (req, res) => {
//     console.log("Data received:");
//     console.log(req.body);

//     res.status(200).json({
//         message: "Data received successfully",
//         data: req.body
//     });
//     return res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
// });

// app.listen(5173, () => {
//     console.log("Backend running on port 5000");
// });