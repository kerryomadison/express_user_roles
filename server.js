require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {random}=require('lodash');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const statesRouter = require('./routes/api/states');
const mongoose=require('mongoose');
const connectDB=require('./config/dbConn');
const PORT = process.env.PORT || 3500;

//connect to mongodb
connectDB();

app.use('/api/states', statesRouter); //use router 
// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
//app.use('/employees', require('./routes/api/employees')); not needed 
const State = require('./model/States');

// Sample fun facts for each state
const funFacts = {
    'KS': ['Kansas has the largest population of wild grouse in North America. The grouse is commonly called the prairie chicken.', 
    'The official song of the state of Kansas is called ‘Home On the Range’', 
    'Official Kansas flag adoption date is March 23, 1927'],
    'MO': ['Missouri ties with Tennessee as the most neighborly state in the union, bordered by 8 states.',
    'The state animal is the Mule.', 
    'Flowering Dogwood is the official state tree of Missouri'],
    'OK': ['There is an operating oil well on state capitol grounds called Capitol Site No. 1.', 
    'Tahlequah, Oklahoma is the Tribal capital of the Cherokee Nation.', 
    'Oklahoma was the setting for the movie “Twister”.'],
    'NE': ['The Lied Jungle located in Omaha is the world’s largest indoor rain forest.', 
    'Nebraska has the U.S.’s largest aquifer (underground lake/water supply), the Ogalala aquifer.', 
    'Nebraska’s State Gem is the Blue Agate'],
    'CO': ['Colorado’s southwest corner borders Arizona, New Mexico and Utah the only place in America where the corners of four states meet.', 
    'Colorado has 222 state wildlife areas.', 
    'John Henry “Doc” Holliday’s brief and tumultuous existence led him to Glenwood Springs where he succumbed to tuberculosis and died at the Hotel Glenwood on November 8, 1887.']
};

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
        res.status(404).json({ error: 'State not found or no fun facts available' });
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