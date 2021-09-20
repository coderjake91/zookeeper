const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const fs = require('fs');
const path = require('path');
const express = require('express');
const {animals} = require('./data/animals');
//use and environment variable to set the application PORT (HTTP = port 80, HTTPS = port 443)
const PORT = process.env.PORT || 3001;

//instantiate the server
const app = express();

//---------------Middleware----------------------------------------------------
//interpret incoming POST request data for use by the server
app.use(express.urlencoded({extended: true}));
//parse incoming JSON data
app.use(express.json());
//serve other static assets in the public folder
app.use(express.static('public'));
//if client navigates to <host>/api, then use router in apiRoutes
app.use('/api', apiRoutes);
//if client navigates to <host>/, then use router in htmlRoutes
app.use('/', htmlRoutes);
//-----------------------------------------------------------------------------

//alow server to listen on port 3001
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
