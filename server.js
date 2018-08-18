const express = require("express");
const bp = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");

const app = express();
const database = {
    users: [
        {
            id: "1",
            name: "Felix",
            email: "fh@mail.com",
            password: "hehe",
            entries: 0,
            joined: new Date()
        },
        {
            id: "2",
            name: "Ruslan",
            email: "rus@mail.com",
            password: "xexe",
            entries: 1,
            joined: new Date()
        }
    ]
};

app.use(bp.json());
app.use(cors());

app.listen(3000, () => {
    console.log("App is running in port 3000");
});

app.get("/", (req, res) => {});

//Login

app.post("/signin", (req, res) => {
    database.users.forEach(user => {
        if (req.body.email === user.email) {
            return res.json(user);
        }
    });
});

app.post("/register", (req, res) => {
    database.users.push({
        id: database.users.length,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length - 1]);
});

app.put("/image", (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });
    if (!found) return res.status(400).json("Not found");
});

/*

    /signin --> POST
    /register --> POST
    /image --> PUT
    /profile/:id --> GET 
             param!
    

*/
