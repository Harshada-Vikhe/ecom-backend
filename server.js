//starting file of the project

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const server_config = require("./configs/server.config");
const db_config = require("./configs/db.config");
const bcrypt = require("bcryptjs");

app.use(express.json())
//create an admin user at the starting of the application
//if not already not present

//connection with mongodb
mongoose.connect(db_config.DB_URL);
const db = mongoose.connection;

db.on("error", () => {
  console.log("error while connecting to momgodb");
});

db.once("open", () => {
  console.log("connected to mongodb");
  init();
});
const user_model = require("./models/user.model");

async function init() {
  try {
    const user = await user_model.findOne({ userId: "admin" });
    if (user) {
      console.log("Admin is already present");
      return;
    }
  } catch (error) {
    console.log("error while reading data", error);
  }

  try {
    // const salt = bcrypt.genSaltSync(10);
    user = await user_model.create({
      name: "Harsha",
      userId: "admin",
      email: "harsh@gmail.com",
      userType: "ADMIN",
      password: bcrypt.hashSync("welcome",8),
    });
    console.log("admin created", user);
  } catch (error) {
    console.log("error while creating error", error);
  }
}

// stitch route to server

require('./routes/auth.route')(app)
require('./routes/category.routes')(app)

//start server
app.listen(server_config.PORT, () => {
  console.log("server started", server_config.PORT);
});
