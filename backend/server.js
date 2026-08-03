const express = require('express');

const app = express();

// app.use(express.json());

const tasks = [{id:1,task:"do the task"},{id:2,task:"finish the task"}]

app.get("/new",(req,res)=>{
    for(let i=0;i<tasks.length;i++){
    if(tasks[i].id==1){
    res.send(tasks[i].task)
    }
    }
});

app.listen(5000,()=>{
    console.log("Server running http://localhost:5000");
});