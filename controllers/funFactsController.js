// funFactsController.js

const State = require('../model/States');

const getRandomFunFact = async (stateCode) => {
    const stateData = await State.findOne({ stateCode });
    if (!stateData || !stateData.funFacts || stateData.funFacts.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * stateData.funFacts.length);
    return stateData.funFacts[randomIndex];
};

const addFunFactsToState = async (req, res) => {
    try {
        const stateCode = req.params.stateCode;
        const newFunFacts = req.body.funFacts;
        if (!Array.isArray(newFunFacts)) {
            return res.status(400).json({ message: 'Fun facts should be an array' });
        }

        const updatedState = await State.findOneAndUpdate(
            { stateCode },
            { $push: { funFacts: { $each: newFunFacts } } },
            { new: true }
        );

        if (!updatedState) {
            return res.status(404).json({ message: 'State not found' });
        }

        res.json(updatedState);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getRandomFunFact,
    addFunFactsToState
};