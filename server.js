const express = require('express');
const {animals} = require('./data/animals');
//use and environment variable to set the application PORT (HTTP = port 80, HTTPS = port 443)
const PORT = process.env.PORT || 3001;

//instantiate the server
const app = express();

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

//important note: this GET route must come before other param routes
app.get('/api/animals', (req, res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req,res) => {
    const result = findById(req.params.id, animals);
    if(result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

//alow server to listen on port 3001
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
