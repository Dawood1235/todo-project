const express = require("express");
const router = express.Router();

const {getallTasks, deltask, getallUsers, getUsersStats, updatedUser} = require("../controller/admintodocont.js");
const {authmiddleware} = require("../middleware/auth.js");
const {rolemiddleware} = require("../middleware/rolemdl.js");


router.get("/alltsks",authmiddleware,rolemiddleware("admin"),getallTasks);

router.delete("/admndel",authmiddleware,rolemiddleware("admin"),deltask);

router.get("/admndsb",authmiddleware,rolemiddleware("admin"),getallUsers);

router.get("/stats",authmiddleware,rolemiddleware("admin"),getUsersStats);

router.patch("/admntaskupdate/:_id",authmiddleware,rolemiddleware("admin"),updatedUser);



module.exports = router;



