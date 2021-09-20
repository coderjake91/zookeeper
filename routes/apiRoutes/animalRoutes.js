//allow for the interance of the 'app' express server in server.js to be used in this router file
const router = require('express').Router();
const {filterByQuery, findById, createNewAnimal, validateNewAnimal} = require('../../lib/animals');
const {animals} = require('../../data/animals.json');

//important note: express router function will append /api to the front of each routing path
//other important note: this GET route must come before other param routes
router.get('/animals', (req, res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }

    if(results.length != 0){
        res.json(results);
    } else {
        res.status(400).send('The data you requested does not exist.')
    }
    
});

router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result) {
        res.json(result);
    } else {
        res.status(404).send('The data you requested does not exist.');
    }
});

router.post('/animals', (req, res) => {
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

module.exports = router;