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

    // Check for admin credentials
    if (username === "admin" && password === "admin111") {
        return res.redirect("/admin/dashboard");
    }

    // Check for regular user credentials
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

// Admin dashboard route
app.get("/admin/dashboard", function(req,res){
   res.sendFile(__dirname + "/admin_dashboard.html"); 
});

// Fetch all users (Admin)
app.get("/admin/users", function(req, res) {
    connection.query("SELECT * FROM loginuser", function(error, results) {
        if (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Server error");
            return;
        }
        res.json(results);
    });
});

// Fetch all bookings for admin
app.get("/admin/bookings", function(req, res) {
    connection.query("SELECT * FROM booking", function(error, results) {
        if (error) {
            console.error("Error fetching bookings:", error);
            res.status(500).send("Server error");
            return;
        }
        res.json(results);
    });
});

// Confirm a reservation by admin
app.post("/admin/confirm/:id", function(req,res){
   const id=req.params.id; 
   connection.query(
       "UPDATE booking SET status='confirmed' WHERE id=?",[id],function(error){
           if(error){
               console.error(error);
               return res.status(500).send('Server Error');
           }
           return res.send('Reservation confirmed');
       });
});

// Refuse a reservation by admin
app.post("/admin/refuse/:id",function(req,res){
   const id=req.params.id; 
   connection.query(
       "UPDATE booking SET status='refused' WHERE id=?",[id],function(error){
           if(error){
               console.error(error);
               return res.status(500).send('Server Error');
           }
           return res.send('Reservation refused');
       });
});
// Fetch all users (Admin)
app.get("/admin/users", function(req, res) {
    connection.query("SELECT * FROM loginuser", function(error, results) {
        if (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Server error");
            return;
        }
        res.json(results);
    });
});

// Update a user (Admin)
app.put("/admin/users/:id", encoder, function(req, res) {
    const id = req.params.id;
    const { username, password } = req.body; // Assuming you want to update username and password
    connection.query(
        "UPDATE loginuser SET username = ?, password = ? WHERE id = ?", 
        [username, password, id], 
        function(error) {
            if (error) {
                console.error("Error updating user:", error);
                res.status(500).send("Server error");
                return;
            }
            res.send("User updated successfully");
        }
    );
});

// Delete a user (Admin)
app.delete("/admin/users/:id", function(req, res) {
    const id = req.params.id;
    connection.query(
        "DELETE FROM loginuser WHERE id = ?", 
        [id], 
        function(error) {
            if (error) {
                console.error("Error deleting user:", error);
                res.status(500).send("Server error");
                return;
            }
            res.send("User deleted successfully");
        }
    );
});
// Start the server on port 4000
app.listen(4000,function(){
   console.log("Server is running on port 4000..."); 
});
