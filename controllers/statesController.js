const State = require('../model/States');

const getAllStates = async (req, res) => {
    try {
        let states = await State.find();
        if (req.query.contig === 'false') {
            res.json(states);
        } else {
            states = states.filter(state => state.stateCode !== 'AK' && state.stateCode !== 'HI');
            res.json(states);
        }
    } catch (err) {
        console.error(err);
        res.status(404).json({ message: 'Server Error' });
    }
};

const createState = async (req, res) => {
    try {
        const { stateCode, funFacts } = req.body;
        if (!stateCode || !funFacts || !Array.isArray(funFacts)) {
            return res.status(400).json({ message: 'State code and an array of fun facts are required' });
        }
        const state = new State({
            stateCode: stateCode.toUpperCase(),
            funFacts
        });
        await state.save();
        res.status(201).json(state);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateState = async (req, res) => {
    try {
        const { id } = req.params;
        const { stateCode, funFacts } = req.body;
        if (!stateCode || !funFacts || !Array.isArray(funFacts)) {
            return res.status(400).json({ message: 'State code and an array of fun facts are required' });
        }
        const state = await State.findByIdAndUpdate(id, { stateCode: stateCode.toUpperCase(), funFacts }, { new: true });
        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }
        res.json(state);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteState = async (req, res) => {
    try {
        const { id } = req.params;
        const state = await State.findByIdAndDelete(id);
        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }
        res.json({ message: 'State deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getState = async (req, res) => {
    try {
        const { stateCode } = req.params;
        const state = await State.findOne({ stateCode: stateCode.toUpperCase() });
        if (!state) {
            return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
        }
        res.json(state);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllStates,
    createState,
    updateState,
    deleteState,
    getState
};