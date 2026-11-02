require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./src/routes/routes");

const app = express();
const port = Number(process.env.PORT || 5000);
const corsOrigin = process.env.CORS_ORIGIN || "*";

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", corsOrigin);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    return next();
});

app.use(express.json());
app.use("/api", routes);

app.get("/", (req, res) => {
    return res.status(200).json({ message: "Task management API is running" });
});

async function startServer() {
    const mongoUri = process.env.MongoDB_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error("Set MongoDB_URI (or MONGODB_URI) before starting the server");
    }

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log("MongoDB connected");

    return app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

if (require.main === module) {
    startServer().catch((error) => {
        console.error("Failed to start server:", error);
        process.exitCode = 1;
    });
}

module.exports = { app, startServer };
