const express = require("express");
const app = express();
const mysql = require("mysql2");
const path = require("path");
const fileUploader = require("express-fileupload");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const moment = require("moment");
const currentDate = moment().format("YYYY-MM-DD HH:mm:ss"); 





app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(fileUploader());

const connection = mysql.createPool({
  user: "naveen",
  password: "Naveen@142005",
  host: "localhost",
  database: "forus",
});

connection.query("SELECT * FROM images", (error, rows, fields) => {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Second row:");
  }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload_or_views", (req, res) => {
  const secretCode = req.body.secretCode;

  console.log(secretCode);
  if (secretCode == "naveen") res.render("imageFile");
  else res.send("Wrong code....");
});

app.post("/upload_images", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  } else {
    const img = req.files.image;

    const img_data = img.data;

    const sql = "INSERT INTO Images (image_data, created_at) VALUES (?, NOW())";
    connection.query(sql, [img_data], (err, result) => {
      if (err) {
        console.error("Error inserting image:", err);
        return res.status(500).send("Error uploading image.");
      }
      console.log("Image uploaded successfully:", result);
      res.status(200).send("Image uploaded successfully.");
    });
  }
});

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
    user: 'ourimagesnb@gmail.com',
    pass: 'saxm sizi tkkn jbre'
  }
});


app.post("/view_images", (req, res) => {
  const flag = req.body.hiddenValue;

  console.log(flag + "HELLO");
  if (flag == "naveen__") {
    const sql = "SELECT * FROM Images";
    connection.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching images:", err);
        return res.status(500).send("Error fetching images.");
      }

      const images = results.map((result) => ({
        id: result.id,
        createdAt: result.created_at.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        imageData: result.image_data.toString("base64"),
      }));

      const mailOptions = {
        from: 'ourimagesnb@gmail.com',
        to: 'valarmathi43679@gmail.com',
        subject: 'Images loaded successfully',
        text: `<h1>Images Viewed on ${currentDate}.</h1>`,
        html: `<h1>Images Viewed on ${currentDate}.</h1>`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
          return res.status(500).send("Error sending email.");
        }
        console.log("Email sent: " + info.response);
        res.render("last", { images });
      });
    });
  } else {
    res.send("Error");
  }
});

app.post("/delete-image", (req, res) => {
  const imageId = req.body.id;

  if (!imageId) {
    return res.status(400).send("Image ID is required");
  }

  connection.query(
    "DELETE FROM Images WHERE id = ?",
    [imageId],
    (err, results) => {
      if (err) {
        return res.status(500).send("Failed to delete image");
      }

      if (results.affectedRows === 0) {
        return res.status(404).send("Image not found");
      }

      res.send("Image deleted successfully");
    }
  );
});


app.listen(3000)

                            //343698  


                              //6619 7954 6965