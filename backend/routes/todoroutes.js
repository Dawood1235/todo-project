const express = require("express");
const router = express.Router();

const {createtodo,getTodos,delTodo,editTodo,updateProfile,getProfile,getTodoById} = require("../controller/todocontroller.js");

const { verifyToken } = require("../middleware/auth.js");
const {authmiddleware} = require("../middleware/auth.js");


router.use(verifyToken);

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);



// Task / Todo Routes
router.get("/tasks", getTodos);
router.post("/tasks", createtodo);
router.patch("/tasks", editTodo);
router.delete("/tasks", delTodo);
router.put("/profile", updateProfile);

router.get("/tasks/:id", getTodoById);

// router.get("/tasks", verifyToken, getTodos);
// router.post("/tasks", verifyToken, createtodo);
// router.get("/new",authmiddleware,getTodos);
// router.delete("/del",authmiddleware,delTodo);
// router.post("/new",authmiddleware,createtodo);
// router.patch("/edt",authmiddleware,editTodo);
// router.put("/profile",authmiddleware,updateProfile);



module.exports = router;