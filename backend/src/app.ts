import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import projectRoutes from "./routes/project.routes";
import requestRoutes from "./routes/request.routes";
import notificationRoutes from "./routes/notification.routes";
import { errorHandler } from "./middleware/error.middleware";
import { config } from "./config";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), config.upload.dir)));

app.use(errorHandler);

export default app;
