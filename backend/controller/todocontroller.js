const Task = require("../models/todo");
const User = require("../models/user");
const notification = require("../models/notification");

const getTodos = async(req,res)=>{
  try {

  const page = Number(req.query.page) || 1;
  const search = req.query.search || "";
  const limit = 9;

  const filter = {
    userId: req.userId
  }

  if(search.trim()!== ("")){
      filter.$or=[
      {task:{
        $regex: search.trim(),
        $options: "i"
      }
      },
        {description:{ 
        $regex: search.trim(),
        $options: "i"
        }
      }
    ];
  }
  
  // db.tasks.deleteOne({});
  

  const result = await Task.paginate(
    filter,
    { page: page,
      limit: limit
    }
  )


//   if(userTasks.length != 0){
//   result = await Task.paginate(
    
//     filter,
//     {
//       page: page,
//       limit: limit
//     }
//   ); 
// }

//   else{
//     result = {
//       docs: [],
//       totaldocs: 0,
//       limit: limit,
//       page: 1,
//       totalPages: 0
//     };
//   }

  console.log(result);

  res.status(200).json(result);

  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      error: error.message
    });
  }
};


const delTodo = async(req,res)=>{
    
     const id = req.query._id;

     const result = await Task.deleteOne({_id:id, userId:req.userId});

     res.json(result); 
}

const editTodo = async(req,res)=>{
   const id = req.query.id;
   const data = req.body.data;

   const updatedTask = await Task.findOneAndUpdate(
      {_id:id,
        userId: req.userId
      },
      data,
      {new: true}
   )

   res.json(updatedTask);
}

// app.post("/new",async(req,res)=>{
const createtodo = async (req,res)=>{
    try{
        const tasks = new Task({
            task: req.body.task,
            description: req.body.description,
            date: req.body.date,
            time: req.body.time,
            category: req.body.category,
            priority: req.body.priority,
            progress: req.body.progress,
            reminder: req.body.reminder,
            link: req.body.link,
            status: "Pending",
            userId: req.userId
        });


    console.log("USER ID FROM TOKEN:", req.userId);

    const savedTask = await tasks.save();


    console.log("SAVED TASK:", savedTask);
console.log("SAVED TASK ID:", savedTask._id);
console.log("SAVED USER ID:", savedTask.userId);


    console.log("Task Saved");

    await notification.create({
      userId: req.userId,
      message: `Task "${savedTask.task}" was added`,
      taskid: savedTask._id.toString()
    });

    res.json(savedTask);
    } catch(error){
        console.error("ERROR:", error);
        res.status(500).json({error: error.message});
    }
    // console.log("BODY:", req.body);
}


const getProfile = async(req,res) => {
  try{

    const user = await User.findById(
      req.userId);

    if(! user){
      return res.status(404).json({
        message: "User nor found",
      })
    }

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePic: user.profilePic
    })
  }
  catch(error){
    console.log("Error updating profile", error);

    res.status(500).json({
      message: "Server error"
    });
  }
}

const updateProfile = async(req,res) => {
  try{
            console.log("REQ USER:", req.user);
        console.log("REQ BODY:", req.body);

    const {firstName, lastName, profilePic } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        profilePic
      },
      {new: true}
    );

    if(! user){
      return res.status(404).json({
        message: "User nor found",
      })
    }

    res.status(200).json({
      message: "Profile updated Successfully",
      user
    })
  }
  catch(error){
    console.log("Error updating profile", error);

    res.status(500).json({
      message: "Server error"
    });
  }
}

const getTodoById = async (req,res)=>{
  try{
    const id = req.params.id;

    const task = await Task.findOne({
      _id: id,
      userId: req.userId
    });

    if(!task){
      return res.status(404).json({
          message: "Task not found"
      })
    }
    res.status(200).json(task);
  }catch(error){
    console.error("Error:", error);

    res.status(500).json({
      error: error.message
    });
  }
};


module.exports = {
    getTodos,createtodo,delTodo,editTodo,updateProfile, getProfile,getTodoById
};
