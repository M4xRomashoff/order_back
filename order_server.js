const express = require("express");
const cors = require("cors");

const app = express();
const path = require('path');

// var corsOptions = {
//   origin: "http://localhost:3000"
// };

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));



db.sequelize.sync();

// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });
//
// function initial() {
//   Role.create({
//     id: 1,
//     name: "user"
//   });
//
//   Role.create({
//     id: 2,
//     name: "admin"
//   });
//
// }



app.all("*", (req, res, next) => {
  console.log('req.url--',req.url); // do anything you want here
  next();
});

// simple route
app.get("/test", (req, res) => {
  res.json({ message: "Welcome to Max R application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);


// set port, listen for requests
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Shop Server is running on port ${PORT}.`);
});





