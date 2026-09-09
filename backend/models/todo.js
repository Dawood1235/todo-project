const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { boolean } = require("yup");

const taskSchema = 
new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    category:{ 
       type: String,
       enum: ["Work","Study","Personal","Shopping"],
       default: "Work"

    },
    priority: {
       type: String,
       enum: ["Low","Medium","High"],
       default: "Low"
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    reminder: {
        type: Boolean,
        default: false
    },
    reminderSent: {
    type: Boolean,
    default: false
    },
    
    link: {
       type: String,
       default: "Not set"
    },
    status: {
        type: String,
        default: "Pending"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

});

taskSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Task",taskSchema);