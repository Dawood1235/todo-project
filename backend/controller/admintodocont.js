const Task = require("../models/todo");
const User = require("../models/user");


const getallTasks = async(req,res)=>{
  try {

  const page = Number(req.query.page) || 1;
  const search = req.query.search || "";
  const limit = 9;

  const filter = {

  }

  let result;

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
  

  result = await Task.paginate(
    
    filter,
    {
      page: page,
      limit: limit
    }
  ); 


  

  console.log("USER ID:", req.userId);
  console.log("TASKS:", result.docs);


  console.log(result);

  res.status(200).json(result);

  

  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      error: error.message
    });
  }
};

const deltask = async(req,res)=>{
    try{
    
    const id = req.query.id;
    const deletedTask = await Task.findOneAndDelete({_id:id});

    res.json(deletedTask);
    
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

const getallUsers = async(req,res)=>
{
    try{
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const search = req.query.search?.trim() || "";
    let query = {}

    if(search){
      query = {
        $or : [
            {firstName: {$regex: search, $options: "i"}},
            {lastName: {$regex: search, $options: "i"}},
            {email:  {$regex: search, $options: "i"}},
            {role: {$regex: search, $options: "i"}}
        ]
      };
    }

    const result = await User.paginate(query, {
      page: page,
      limit: limit,
      sort: {_id: -1}
    })
    res.json(result);
    }

    catch(error){
      console.log(error);
      res.status(500).json({message: "Server Error"});
    }
};


const getUsersStats = async(req,res)=>{
    try{
              console.log("1. Stats controller reached");

        const userStats = await User.aggregate([
        {
          $group: {
            _id: "$role",
            count: {$sum: 1}
          }
        }
       ])

               console.log("2. User aggregation worked");
        console.log("User stats:", userStats);

       const taskStats = await Task.aggregate([
        {
         $group: {
          _id: "$status",
          count: {$sum:1}
          }
         }
       ])

               console.log("3. Task aggregation worked");
        console.log("Task stats:", taskStats);



       let totalUsers = 0;
       let totalAdmins = 0;
       let totalPending = 0;
       let totalCompleted = 0;

       userStats.forEach((item)=>{
          if(item._id === "user"){
            totalUsers= item.count;
          }

          if(item._id == "admin"){
            totalAdmins = item.count;
          }
       });

       taskStats.forEach((item)=>{

                    console.log(
                "STATUS:",
                item._id,
                "COUNT:",
                item.count);

          if(item._id === "Pending"){
            totalPending= item.count;
          }

          if(item._id == "Completed"){
            totalCompleted = item.count;
          }
       });

       res.json({
        totalUsers,
        totalAdmins,
        totalCompleted,
        totalPending
       });

      } catch(error){

                console.error("❌ STATS ERROR:");
        console.error(error);

        res.status(500).json({
          message: error.message
        })
      }
}

const updatedUser = async(req,res)=>{
  try{
    const {_id} = req.params;
    const {task,description,date,time,category,priority,progress,link,status } = req.body
    const result = await Task.findByIdAndUpdate(

    _id,
    {
      task, 
      description,
      date, 
      time,
      category,
      priority,
      progress,
      link,
      status
    },
    
    {new: true}

  );

  if(!result){
     res.status(404).json({
        message: "Task not foound"
     })
  }

  res.json(result)

   }catch(error){
    console.log(error);
    res.status(500).json({
       message: "Failed to update task",
       error: error.message
    });
  }
}

module.exports = {getallTasks, deltask, getallUsers,getUsersStats, updatedUser};