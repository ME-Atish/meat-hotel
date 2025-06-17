const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const port = process.env.PORT || 4000;

// connect to database
(async () => {
  await mongoose.connect(process.env.MONGOOSE_URI);
  console.log("connected to the MongoDB ");
})();

// app run into port process.env.PORT (Example at .env.example)
app.listen(port, () => {
  console.log(`Connected to the port ${port}`);
});
