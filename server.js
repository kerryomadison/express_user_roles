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

// Handle favicon.ico request
app.get('/favicon.ico', (req, res) => res.status(204).end());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

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
app.use('/', require('./middleware/verifyStates'));


//app.use(verifyJWT);
//app.use('/employees', require('./routes/api/employees')); not needed 


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
// Define the route handler for /states/:stateCode/funfact
app.get('/states/:stateCode/funfact', (req, res) => {
    const stateCode = req.params.stateCode.toUpperCase(); // Convert state code to uppercase

    if (funFacts[stateCode]) {
        const randomIndex = Math.floor(Math.random() * funFacts[stateCode].length);
        const randomFunFact = funFacts[stateCode][randomIndex];
        res.json({ funfact: randomFunFact });
    } else {
        res.status(404).json({ error: 'Invalid state abbreviation parameter' });
    }
});
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