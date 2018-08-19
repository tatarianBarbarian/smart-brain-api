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
    const { email, password } = req.body;
    const hash = bcrypt.hashSync(password);

    db.select("email", "hash")
        .from("login")
        .where("email", email)
        .then(data => {
            if (data.length) {
                const isValid = bcrypt.compareSync(password, data[0].hash);
                if (isValid) {
                    return db
                        .select("*")
                        .from("users")
                        .where("email", email)
                        .then(data => res.json(data[0]))
                        .catch(err => res.status(404).json("Error!"));
                } else {
                    res.status(300).json("Bad creditinals");
                }
            } else {
                res.status(404).json("Error!");
            }
        })
        .catch(err => res.status(300).json("Bad creditinals"));
});

app.post("/register", (req, res) => {
    const { email, password, name } = req.body;
    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into("login")
            .returning("email")
            .then(loginEmail => {
                return trx("users")
                    .returning("*")
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => res.json(user[0]))
                    .catch(err => res.status(400).json("Unable to register"));
            })
            .then(trx.commit)
            .catch(trx.rollback);
    });
});

app.put("/image", (req, res) => {
    const { id } = req.body;

    db("users")
        .where("id", "=", id)
        .increment("entries", 1)
        .returning("entries")
        .then(entries => {
            if (entries.length) res.json(entries[0]);
            else res.status(400).json("Bad request");
        })
        .catch(err => {
            res.status(400).json(err);
        });
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
