const express = require('express');
const {animals} = require('./data/animals');

//instantiate the server
const app = express();

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

app.get('/api/animals', (req, res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//alow server to listen on port 3001
app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
});
