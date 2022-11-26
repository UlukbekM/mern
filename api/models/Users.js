const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },tasks: [{
        taskname: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        completed: {
            type: Boolean,
            required: true
        }
    }]
});

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel;