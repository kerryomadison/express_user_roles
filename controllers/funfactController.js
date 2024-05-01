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

module.exports = {
    getRandomFunFact
};
