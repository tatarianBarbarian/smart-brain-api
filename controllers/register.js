const handleRegister = (bcrypt, db) => (req, res) => {
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
};

module.exports = {
    handleRegister: handleRegister
};
