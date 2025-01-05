const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded({ extended: true });

const app = express();

// Serve static files from 'assets' and 'images' folder
app.use("/assets", express.static("assets"));
app.use("/images", express.static("images"));

// MySQL Database connection setup
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node.js"
});

// Connect to the MySQL database
connection.connect(function (error) {
    if (error) {
        console.error("Error connecting to the database: ", error);
        throw error;
    } else {
        console.log("Connected to database successfully!");
    }
});

// Route for the login page
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

// POST route to handle login form submission
app.post("/", encoder, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        return res.redirect("/");
    }

    connection.query(
        "SELECT * FROM loginuser WHERE username = ? AND password = ?",
        [username, password],
        function (error, results) {
            if (error) {
                console.error("Error in query:", error);
                res.status(500).send("Server error");
                return;
            }

            if (results.length > 0) {
                res.redirect("/welcome");
            } else {
                res.redirect("/");
            }
        }
    );
});

// Route for the sign-up page
app.get("/signup", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

// POST route to handle sign-up form submission
app.post("/signup", encoder, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        return res.redirect("/signup");
    }

    connection.query(
        "SELECT * FROM loginuser WHERE username = ?",
        [username],
        function (error, results) {
            if (error) {
                console.error("Error in query:", error);
                res.status(500).send("Server error");
                return;
            }

            if (results.length > 0) {
                res.send("Username already exists. Please try another one.");
            } else {
                connection.query(
                    "INSERT INTO loginuser (username, password) VALUES (?, ?)",
                    [username, password],
                    function (insertError) {
                        if (insertError) {
                            console.error("Error inserting data:", insertError);
                            res.status(500).send("Server error");
                            return;
                        }
                        res.redirect("/");
                    }
                );
            }
        }
    );
});

// Route for the welcome page after successful login
app.get("/welcome", function (req, res) {
    res.sendFile(__dirname + "/welcome.html");
});

// Route for booking page
app.get("/book", function (req, res) {
    res.sendFile(__dirname + "/welcome.html");
});

// POST route to handle booking form submission
app.post("/book", encoder, function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var checkin = req.body.checkin;
    var checkout = req.body.checkout;
    var roomType = req.body['room-type'];
    var guests = req.body.guests;

    if (!name || !email || !checkin || !checkout || !roomType || !guests) {
        return res.redirect("/book");
    }

    connection.query(
        "INSERT INTO booking (name, email, checkin_date, checkout_date, room_type, guests) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, checkin, checkout, roomType, guests],
        function (insertError) {
            if (insertError) {
                console.error("Error inserting booking data:", insertError);
                res.status(500).send("Server error");
                return;
            }
            res.redirect("/book?success=true");
        }
    );
});

// Route to handle contact form submission
app.post('/submit-contact', encoder, (req, res) => {
    const { name, email, subject, message } = req.body;

    // SQL query to insert data into 'messages' table
    const query = 'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)';
    
    connection.query(query, [name, email, subject, message], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('There was an error processing your request');
        }
        console.log('Message stored in database');
        res.send('Message sent successfully!');
    });
});

// Start the server on port 4000
app.listen(4000, function () {
    console.log("Server is running on port 4000...");
});
