import  express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import UserRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST", "DELETE", "PUT"],
      credentials: true,
    })
  );


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected")).catch(err => console.log(err));



const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: "Too many requests, please try again later."
});

app.use(limiter);
app.use("/api/auth", UserRoutes);

app.get("/", (req, res) => res.send("API Running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
