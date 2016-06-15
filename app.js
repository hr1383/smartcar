
// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
var router = express.Router();              // get an instance of the express Router
var vehicles = require('./routes/vehicles');

app.use('/vehicles', vehicles);

app.use(function(req, res, next) {
  res.status(404).send({ error: 'Url Not found' });
});

app.use(function(error, req, res, next) {
  if (error.status) {
    res.status(error.status).send(error);     
  } else {
    res.status(500).send({"status" : "500", "reason": "Internal server error"});
  }
});

// START THE SERVER
// =============================================================================
app.listen(port);