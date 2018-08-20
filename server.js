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
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on the port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
    res.send("It's all working!");
});

app.post("/signin", signIn.handleSignIn(bcrypt, db));

app.post("/register", register.handleRegister(bcrypt, db));

app.put("/image", image.handleImageGet(db));

app.post("/imageurl", image.handleApiCall);

app.get("/profile/:id", profile.handleProfileGet(db));
