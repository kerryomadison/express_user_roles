require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const favicon = require('serve-favicon');
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const statesRouter = require('./routes/api/states');
const statesController = require('./controllers/statesController');
const funFactsController = require('./controllers/funFactsController'); 
const State = require('./model/States');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
// app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());



/*app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, './views/index.html'));
});
*/
// routes
app.use('/states', statesRouter); // Use router from statesRouter
app.use('/', require('./routes/root'));

//app.use('/register', require('./routes/register'));
//app.use('/auth', require('./routes/auth'));
//app.use('/refresh', require('./routes/refresh'));
// app.use('/logout', require('./routes/logout'));
app.use('/states/:statecode', require('./middleware/verifyStates'));

// Handle favicon.ico request
app.get('/favicon.ico', (req, res) => res.status(204).end());

//app.use(verifyJWT);
//app.use('/employees', require('./routes/api/employees')); not needed 
//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Define the route handler for the root
/*app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './views/index.html'));
});
*/
// Define the route handler for adding a fun fact to a state
app.post('/states/:stateCode/funfact', funFactsController.createFunFacts);
app.patch('/states/:stateCode/funfact', funFactsController.updateFunFacts);
app.delete('/states/:stateCode/funfact', funFactsController.deleteFunFact);
// Define the route handler for getting a random fun fact for a state
app.get('/states/:stateCode/funfact', funFactsController.getRandomFunFact);

/*commenting out implementation that no longer needed. 
// Save fun facts to the database
Object.entries(funFacts).forEach(([stateCode, facts]) => {
    const state = new State({
        stateCode,
        funFacts: facts
    });
    state.save();
});
*/
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);
mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});