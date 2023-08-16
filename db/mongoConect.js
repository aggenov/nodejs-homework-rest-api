const mongoose = require("mongoose");
const { DB_URI } = process.env;

async function dbConnect() {
  await mongoose
    .connect(DB_URI)
    .then(console.log("Database connection successful"))
    .catch((error) => {
      console.log(error.message);
      process.exit(1);
    });
}

module.exports = dbConnect;
