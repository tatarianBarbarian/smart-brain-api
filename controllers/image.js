const handleImageGet = (req, res, bcrypt, db) => {
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
};

module.exports = { handleImageGet: handleImageGet };
