import express from "express";

import cookieParser  from "cookie-parser";
import startServer from "./connection.js";
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"

const app = express();

app.use(express.json());//to parse the incoming requests with json payloads (from req.body)
app.use(cookieParser());//
app.use("/api/auth" , authRoutes)

app.use("/api/messages" , messageRoutes)

startServer(app);