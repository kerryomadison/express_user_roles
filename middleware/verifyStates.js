// Import the states data
const statesData = require('../model/statesData.json');

// Create an array of state abbreviations
const stateCodes = statesData.map(state => state.code);

// Define the middleware function
const verifyStates = (req, res, next) => {
    // Get the state abbreviation parameter from the request
    const stateCode = req.params.stateCode;

    // Check if the stateCode parameter is undefined or null
    if (!stateCode) {
        // If it is undefined or null, return a bad request status with the required message
        return res.status(400).json({ message: 'State abbreviation parameter is missing' });
    }

    // Convert the state abbreviation to uppercase
    const upperCaseStateCode = stateCode.toUpperCase();

    // Log the state code and the stateCodes array for debugging
    console.log('State code:', upperCaseStateCode);
    console.log('State codes array:', stateCodes);

    // Check if the state abbreviation is in the array of state codes
    if (!stateCodes.includes(upperCaseStateCode)) {
        // If it isn't in the array, return a bad request status with the required message
        return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
    }

    // If it is in the array, set the value on the request and move to the next middleware
    req.stateCode = upperCaseStateCode;
    next();
};

// Export the middleware function
module.exports = verifyStates;