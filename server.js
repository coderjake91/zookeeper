const fs = require('fs');
const path = require('path');
const express = require('express');
const {animals} = require('./data/animals');
//use and environment variable to set the application PORT (HTTP = port 80, HTTPS = port 443)
const PORT = process.env.PORT || 3001;

//instantiate the server
const app = express();
//"Middleware" to interpret incoming POST request data for use by the server
app.use(express.urlencoded({extended: true}));
//parse incoming JSON data
app.use(express.json());

//function that filters user query requests
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    //save animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if(query.personalityTraits) {
        //save personalityTraits as a dedicated array
        //if personalityTraits is a string, then save it to the dedicated array
        if(typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        //iterate through the personalityTraitsArray and filter through each animal's personalityTraits property array to create a new filteredResults array that contains
        // only the animals with the queried traits
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1);
        });
    }
    if(query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if(query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if(query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

//function that finds and returns a single animal object by its id parameter
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    console.log(result);
    return result;
}

//adds the ability of the client to add a new animal to the server
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    //write in the new animal data to the animals.json file in JSON
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray}, null, 2)
    );
    return animal;
}

function validateNewAnimal(animal) {
    if(!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if(!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if(!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)){
        return false;
    }
    return true;
}

//important note: this GET route must come before other param routes
app.get('/api/animals', (req, res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result) {
        res.json(result);
    } else {
        res.status(400).send('The data you requested does not exist.');
    }
});

app.post('/api/animals', (req, res) => {
    //set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    //if any data in req.body is incorrect (validated by validateNewAnimal()), send 400 error back
    if(!validateNewAnimal(req.body)){
        res.status(400).send('The animal is not properly formatted.');
    } else {
        //add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        console.log(animal);
        res.json(animal);
    }
});

//alow server to listen on port 3001
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
