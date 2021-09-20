const router = require('express').Router();
const animalRoutes = require('./animalRoutes');
const zookeeperRoutes = require('./zookeeperRoutes');

//middleware so the app can use the routes in 'animalRoutes.js' or 'zookeeperRoutes.js'
router.use(animalRoutes);
router.use(zookeeperRoutes);

module.exports = router;