const Clarifai = require("clarifai");

const app = new Clarifai.App({
    apiKey: "7fb972b15b7b4dd99273c72169bc88bc"
});

const handleApiCall = (req, res) => {
    const { input } = req.body;
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, input)
        .then(response => {
            // console.log(response);
            res.json(response);
        })
        .catch(err => res.status(400).json("Wrong api call"));
};

const handleImageGet = db => (req, res) => {
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

module.exports = {
    handleImageGet: handleImageGet,
    handleApiCall: handleApiCall
};
