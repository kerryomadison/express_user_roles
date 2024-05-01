const State = require('../model/States');
const statesData= require('../model/statesData.json');
const funFactsController = require('./funFactsController');

const getAllStates = async (req, res) => {
    try {
        let states = statesData;

        // Check if the query parameter contig is present and set to false
        if (req.query.contig === 'false') {
            states = states.filter(state => state.abbreviation !== 'AK' && state.abbreviation !== 'HI');
        }

        // Attach fun facts from MongoDB collection
        await Promise.all(states.map(async state => {
            const stateData = await State.findOne({ stateCode: state.abbreviation });
            if (stateData && stateData.funFacts) {
                state.funFacts = stateData.funFacts;
            }
        }));

        res.json(states);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
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
        const  stateCode  = req.params.state.toUpperCase();
        const state = statesData.find(state=>state.abbreviation===stateCode);
        if (!state) {
            return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
        }
        const stateData= await State.findOne({stateCode});
        if(stateData&&stateData.funFacts){
            state.funFacts=stateData.funFacts;
        }
        res.json(state);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
const getStateFunFact = async (req, res) => {
    try {
        const { stateCode } = req.params;
        const randomFunFact = await funFactsController.getRandomFunFact(stateCode.toUpperCase());

        if (!randomFunFact) {
            return res.status(404).json({ message: 'No fun facts found for this state' });
        }

        res.json({ funfact: randomFunFact });
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
    getState,
    getStateFunFact
};