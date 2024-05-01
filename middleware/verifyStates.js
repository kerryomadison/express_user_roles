// Import the states data
const statesData = require('../model/statesData.json');

// Create an array of state abbreviations
const stateCodes = statesData.map(state => state.abbreviation);

// Define the middleware function
const verifyState = (req, res, next) => {
    // Get the state abbreviation parameter from the request
    const stateCode = req.params.stateCode.toUpperCase();

    // Check if the state abbreviation is in the array of state codes
    if (!stateCodes.includes(stateCode)) {
        // If it isn't in the array, return a bad request status with the required message
        return res.status(400).json({ message: 'Invalid state abbreviation' });
    }

    // If it is in the array, set the value on the request and move to the next middleware
    req.stateCode = stateCode;
    next();
};

// Export the middleware function
module.exports = verifyState;