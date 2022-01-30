const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const nodemailer = require("nodemailer");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
// mysql configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  //   password: "root",
  database: "employee_management",
});
// mysql connection
db.connect((e) => {
  if (e) {
    throw e;
  }
  console.log("database connected");
});

// create a table using hit the api
app.get("/createEmployeeTable", (req, res) => {
  const sql =
    "CREATE TABLE employees(id int AUTO_INCREMENT, firstName VARCHAR(30),lastName VARCHAR(30), email VARCHAR(80), PRIMARY KEY(id))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("table created");
  });
});

// add a new employee to database
app.post("/employee", (req, res) => {
  const data = req.body;
  const sql = "INSERT INTO employees SET?";
  db.query(sql, data, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// add csv employee data to database
app.post("/employees", (req, res) => {
  const data = req.body;
  const sql = "INSERT INTO employees (firstName,lastName,email) VALUES?";
  db.query(sql, [data], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// get all employees
app.get("/employees/:page", (req, res) => {
  const page = req.params.page;
  let start = page * 2;
  let end = start + 2;
  const sql = `SELECT * FROM employees LIMIT ${end} OFFSET ${start}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});

var transport = nodemailer.createTransport({
  host: process.env.HOST,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});
app.post("/sendEmail", async (req, res) => {
  const data = req.body;
  let result = await transport.sendMail({
    from: '"EMS" <bappymia463@gmail.com>', // sender address
    to: data.email, // list of receivers
    subject: data.subject, // Subject line
    text: data.message, // plain text body
    html: "<b></b>", // html body
  });

  console.log(result);
  res.json(result);
});
// ================================================================
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log("Server running on port", port);
});
