const express = require("express");
const router = express.Router();

console.log("AUTH ROUTES FILE LOADED");

const authmodule = require("../controller/authcontroller.js");
console.log("Full exported module:", authmodule);


const {signup,signin} = authmodule;

console.log("signup type:", typeof signup);
console.log("signin type:", typeof signin);


router.post("/signup", signup);
router.post("/signin",signin);

module.exports = router;