const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");
// App controllers
const register = require("./controllers/register");
const signIn = require("./controllers/signin");
const image = require("./controllers/image");
const profile = require("./controllers/profile");

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

app.use(bodyParser.json());
app.use(cors());

app.listen(3000, () => {
    console.log("App is running in port 3000");
});

app.get("/", (req, res) => {});

app.post("/signin", signIn.handleSignIn(bcrypt, db));

app.post("/register", register.handleRegister(bcrypt, db));

app.put("/image", image.handleImageGet(bcrypt, db));

app.get("/profile/:id", profile.handleProfileGet(db));
