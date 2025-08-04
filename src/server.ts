import app from "./app.js";
import db from "./config/db.js"
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 4000;
// app run into port process.env.PORT (Example at .env.example)
app.listen(port, () => {
  console.log(`Connected to the port ${port}`);
  console.log(`Check API document in http://localhost:4000/api-docs/`);
});
