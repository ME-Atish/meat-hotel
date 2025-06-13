const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const port = process.env.PORT || 4000;

(async () => {
  await mongoose.connect(process.env.MONGOOSE_URI);
  console.log("connected to the MongoDB ");
})();

app.listen(port, () => {
  console.log(`Connected to the port ${port}`);
});
