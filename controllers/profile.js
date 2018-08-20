const handleProfileGet = db => (req, res) => {
    const { id } = req.params;
    db.select("*")
        .from("users")
        .where("id", id)
        .then(user => {
            if (user.length) res.json(user);
            else res.json("Ha! Hui!");
        });
};

module.exports = { handleProfileGet: handleProfileGet };
