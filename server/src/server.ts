import express from "express";
import { clerkMiddleware } from "@clerk/express";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(clerkMiddleware());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
