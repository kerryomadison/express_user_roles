const State = require('../model/State');
const statesData = require('../model/statesData.json');

function getStateName(stateCode) {
    const state = statesData.find(state => state.code === stateCode.toUpperCase());
    return state ? state.state : stateCode;
}

const getRandomFunFact = async (req, res) => {
    try {
        const { stateCode } = req.params;

        // Find the state in the database
        let state = await State.findOne({ stateCode: stateCode.toUpperCase() });

        // If state does not exist, return 404
        if (!state) {
            return res.status(404).json({ message: `No Fun Facts found for ${getStateName(stateCode)}` });
        }

        // Check if the state has any fun facts
        if (state.funfacts && state.funfacts.length > 0) {
            const randomIndex = Math.floor(Math.random() * state.funfacts.length);
            return res.json({ funfact: state.funfacts[randomIndex] });
        } else {
            return res.status(404).json({ message: `No Fun Facts found for ${getStateName(stateCode)}` });
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

        // Check if funfacts field is missing or not an array
        if (!funfacts || !Array.isArray(funfacts)) {
            if (!funfacts) {
                return res.status(400).json({ message: 'State fun facts value required' });
            } else {
                return res.status(400).json({ message: 'State fun facts value must be an array' });
            }
        }

        // Find the state in the database
        let state = await State.findOne({ stateCode: stateCode.toUpperCase() });

        // If state does not exist, create a new state record
        if (!state) {
            state = new State({
                stateCode: stateCode.toUpperCase(),
                funfacts: [...funfacts]
            });
        } else {
            // Add the new fun facts to the state without deleting existing ones
            state.funfacts = [...state.funfacts, ...funfacts];
        }

        // Save the updated or new state record
        await state.save();

        // Return the updated or new state record
        return res.status(201).json(state);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const updateFunFacts = async (req, res) => {
    try {
        const { stateCode } = req.params;
        const { index, funfact } = req.body;

        if (!index) {
            return res.status(400).json({ message: 'State fun fact index value required' });
        }

        if (!funfact || typeof funfact !== 'string') {
            return res.status(400).json({ message: 'State fun fact value required' });
        }

        // Find the state in the database
        let state = await State.findOne({ stateCode: stateCode.toUpperCase() });

        // If state does not exist, create a new state record
        if (!state) {
            state = new State({
                stateCode: stateCode,
                funfacts: []
            });
        }
        // Check if there are fun facts to delete
        if (!state.funfacts || state.funfacts.length === 0) {
            return res.status(400).json({ message: `No Fun Facts found for ${getStateName(stateCode)}` });
        }

        // Update the fun fact at the specified index
        if (index < 1 || index > state.funfacts.length) {
            return res.status(400).json({ message: `No Fun Fact found at that index for ${getStateName(stateCode)}` });
        }
        state.funfacts[index - 1] = funfact;

        // Save the updated state record
        await state.save();

        // Return the updated state object
        return res.status(200).json({
            _id: state._id,
            stateCode: state.stateCode,
            funfacts: state.funfacts,
            __v: state.__v,
           // message: 'Fun fact updated successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteFunFact = async (req, res) => {
    try {
        let { stateCode } = req.params;
        const { index } = req.body;

        // Convert state code to uppercase
        stateCode = stateCode.toUpperCase();
        if (!index) {
            return res.status(400).json({ message: 'State fun fact index value required' });
        }
        // Find the state in the database
        let state = await State.findOne({ stateCode });

        // If state does not exist, create a new state record
        if (!state) {
            state = new State({
                stateCode: stateCode,
                funfacts: []
            });
        }

        // Check if there are fun facts to delete
        if (!state.funfacts || state.funfacts.length === 0) {
            return res.status(400).json({ message: `No Fun Facts found for ${getStateName(stateCode)}` });
        }

        // Check if the index is valid
        if (index < 1 || index > state.funfacts.length) {
            return res.status(400).json({ message: `No Fun Fact found at that index for ${getStateName(stateCode)}` });
        }

        // Remove the fun fact at the specified index
        state.funfacts.splice(index - 1, 1);

        // Save the updated state record
        await state.save();

        // Return updated state object without the 'message' property
        return res.status(200).json({ ...state.toObject() });
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