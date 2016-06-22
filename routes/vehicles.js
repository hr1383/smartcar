var express = require('express');
var router = express.Router();
var VehicleFactory = require("./../common/vehicleFactory.js");
var vehicleFactory = new VehicleFactory();
var requestApi = require("./../common/requestApi.js");

router.get('/:id', function(req, res, next) {
  // Create an instance of our factory that makes vehicles
  var vehicle = vehicleFactory.getVehicle(req.params.id);
  var input = vehicle.vehicleInfo.parseInput(req.params.id);
  requestApi(input, vehicle.vehicleInfo.url, function(err, response) {
    if (err) { 
      next(err);
    } else { 
      res.json(vehicle.vehicleInfo.parseOutput(response));   
    } 
  });
});

// vehicle doors status url
router.get('/:id/doors', function(req, res, next) {
  var vehicle = vehicleFactory.getVehicle(req.params.id);
  var input = vehicle.doorsStatus.parseInput(req.params.id);
  requestApi(input, vehicle.doorsStatus.url, function(err, response) {
    if (err) { 
      next(err);
    } else { 
        res.json(vehicle.doorsStatus.parseOutput(response)); 
    } 
  }); 
});

// vehicle fuel status url
router.get('/:id/fuel', function(req, res, next) {
  var vehicle = vehicleFactory.getVehicle(req.params.id);
  var input = vehicle.fuelStatus.parseInput(req.params.id);
  requestApi(input, vehicle.fuelStatus.url, function(err, response) {
    if (err) { 
      next(err);
    } else {
      res.json(vehicle.fuelStatus.parseOutput(response));      
    } 
  }); 
});

// vehicle battery status url
router.get('/:id/battery', function(req, res, next) {  
  var vehicle = vehicleFactory.getVehicle(req.params.id);
  var input = vehicle.batteryStatus.parseInput(req.params.id);
  requestApi(input, vehicle.batteryStatus.url, function(err, response) {
    if (err) { 
      next(err);
    } else {
      res.json(vehicle.batteryStatus.parseOutput(response));      
    }   
  }); 
});

// vehicle engine status url
router.post('/:id/engine', function(req, res, next) {
  var vehicle = vehicleFactory.getVehicle(req.params.id);
  try{
    var input = vehicle.engineAction.parseInput(req.params.id, req.body);
  } catch(e) {
    next({"status" : 400, "message": e});
  }
  requestApi(input, vehicle.engineAction.url, function(err, response) {
    if (err) {
      res.json({"status" : "500", "message": "Cannot complete request"});
    } else {
       res.json(vehicle.engineAction.parseOutput(response));
    }
  });       
});

module.exports = router;
