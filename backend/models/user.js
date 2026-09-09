const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");


const userSchema = new mongoose.Schema ({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },  
    profilePic: {
        type: String,
        default: ""
    }
})

userSchema.plugin(mongoosePaginate);

const User = mongoose.models.User || mongoose.model("User", userSchema);


module.exports = User;