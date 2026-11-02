const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Task name is required"],
            trim: true,
            maxlength: [200, "Task name cannot exceed 200 characters"]
        },
        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: [2000, "Task description cannot exceed 2000 characters"]
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
