import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import institutionRoutes from "./routes/institution.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import enterpriseRoutes from "./routes/enterprise.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);
app.use("/institutions", institutionRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/services", serviceRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/enterprise", enterpriseRoutes);

app.get("/", (req, res) => {
  res.send("Saúde Fácil API is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
