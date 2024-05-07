const State = require('../model/States');
const statesData= require('../model/statesData.json');


const getRandomFunFact = async (req, res) => {
    try {
        const { stateCode } = req.params;

        // Find the state in the statesData array
        const state = statesData.find(state => state.code === stateCode.toUpperCase());
        if (!state) {
            return res.status(404).json({ message: `No state found for code ${stateCode}` });
        }

        // Check if the state has any fun facts
        if (state.funfacts && state.funfacts.length > 0) {
            const randomIndex = Math.floor(Math.random() * state.funfacts.length);
            return res.json({ funfact: state.funfacts[randomIndex] });
        } else {
            return res.status(404).json({ message: `No fun facts found for ${state.name}` });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


const createFunFacts = async (req, res) => {
    try {
        const { stateCode } = req.params;
        const { funfacts } = req.body;

        // Find the state in the statesData array
        const state = statesData.find(state => state.code === stateCode.toUpperCase());
        if (!state) {
            return res.status(404).json({ message: `No state found for code ${stateCode}` });
        }

        // Add the new fun facts to the state
        if (!state.funfacts) {
            state.funfacts = [];
        }
        state.funfacts.push(...funfacts);

        // Return the updated state
        return res.status(201).json(state);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


const updateFunFacts = async (req, res) => {
    try {
        const { stateCode } = req.params;
        const { index, funfact } = req.body;

        if (!index) {
            return res.status(400).json({ message: 'Index value is required' });
        }

        // Find the state in the statesData array
        const state = statesData.find(state => state.code === stateCode.toUpperCase());
        if (!state) {
            return res.status(404).json({ message: `No state found for code ${stateCode}` });
        }

        // Update the fun fact at the specified index
        if (index < 1 || index > state.funfacts.length) {
            return res.status(400).json({ message: 'Invalid index value' });
        }
        state.funfacts[index - 1] = funfact;

        // Return success message
        return res.status(200).json({ message: 'Fun fact updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteFunFact = async (req, res) => {
    try {
        const { stateCode } = req.params;
        const { index } = req.body;

        if (!index) {
            return res.status(400).json({ message: 'Index value is required' });
        }

        // Find the state in the statesData array
        const state = statesData.find(state => state.code === stateCode.toUpperCase());
        if (!state) {
            return res.status(404).json({ message: `No state found for code ${stateCode}` });
        }

        // Remove the fun fact at the specified index
        if (index < 1 || index > state.funfacts.length) {
            return res.status(400).json({ message: 'Invalid index value' });
        }
        state.funfacts.splice(index - 1, 1);

        // Return success message
        return res.status(200).json({ message: 'Fun fact deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getRandomFunFact,
    createFunFacts,
    updateFunFacts,
    deleteFunFact
};