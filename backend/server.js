import express from "express";
import authRoute from "./routes/auth.route.js";
const app = express();

const PORT = 5001;
app.use("/api/v1/auth", authRoute);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
