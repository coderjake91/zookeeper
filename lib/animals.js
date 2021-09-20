const fs = require('fs');
const path = require('path');

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
        path.join(__dirname, '../data/animals.json'),
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateNewAnimal
};