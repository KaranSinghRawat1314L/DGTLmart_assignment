const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

const routes = express.Router();
const editableFields = ["name", "description", "completed"];

function isValidTaskId(id) {
    return mongoose.isValidObjectId(id);
}

function sendError(res, error) {
    if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
        return res.status(400).json({ message: error.message });
    }

    console.error("Task request failed:", error);
    return res.status(500).json({ message: "Internal server error" });
}

routes.post("/add", async (req, res) => {
    try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({ message: "A task object is required" });
        }

        const task = await Task.create(req.body);
        return res.status(201).json(task);
    } catch (error) {
        return sendError(res, error);
    }
});

routes.get("/view", async (req, res) => {
    try {
        const filter = {};
        if (req.query.completed !== undefined) {
            if (req.query.completed !== "true" && req.query.completed !== "false") {
                return res.status(400).json({ message: "completed must be true or false" });
            }
            filter.completed = req.query.completed === "true";
        }

        const tasks = await Task.find(filter).sort({ createdAt: -1 });
        return res.status(200).json(tasks);
    } catch (error) {
        return sendError(res, error);
    }
});

routes.get("/view/:id", async (req, res) => {
    if (!isValidTaskId(req.params.id)) {
        return res.status(400).json({ message: "Invalid task id" });
    }

    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json(task);
    } catch (error) {
        return sendError(res, error);
    }
});

routes.put("/edit/:id", async (req, res) => {
    if (!isValidTaskId(req.params.id)) {
        return res.status(400).json({ message: "Invalid task id" });
    }
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
        return res.status(400).json({ message: "Task updates must be a JSON object" });
    }

    const updates = {};
    for (const field of editableFields) {
        if (Object.prototype.hasOwnProperty.call(req.body, field)) {
            updates[field] = req.body[field];
        }
    }
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "Provide at least one valid task field to update" });
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json(task);
    } catch (error) {
        return sendError(res, error);
    }
});

routes.delete("/delete/:id", async (req, res) => {
    if (!isValidTaskId(req.params.id)) {
        return res.status(400).json({ message: "Invalid task id" });
    }

    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json({ message: "Task deleted", task });
    } catch (error) {
        return sendError(res, error);
    }
});

module.exports = routes;
