const handleSignIn = (bcrypt, db) => (req, res) => {
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
};

module.exports = { handleSignIn: handleSignIn };
