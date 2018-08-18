const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");
const db = require("knex")({
    client: "pg",
    connection: {
        host: "127.0.0.1",
        user: "postgres",
        password: "super",
        database: "smart-brain"
    }
});

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

app.use(bodyParser.json());
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
    const { email, password, name } = req.body;
    db("users")
        .returning("*")
        .insert({
            email: email,
            name: name,
            joined: new Date()
        })
        .then(user => res.json(user[0]))
        .catch(err => res.status(400).json("Unable to register"));
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

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    db.select("*")
        .from("users")
        .where("id", id)
        .then(user => {
            if (user.length) res.json(user);
            else res.json("Ha! Hui!");
        });
});

/*

    /signin --> POST
    /register --> POST
    /image --> PUT
    /profile/:id --> GET 
             param!
    

*/
