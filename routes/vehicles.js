var express = require('express');
var router = express.Router();
var request = require('request');
// vehicle info endpoint
router.get('/:id', function(req, res, next) {
  var input = { id: req.params.id,  responseType: 'JSON' };
  gm_api(input, 'getVehicleInfoService', function(err, response) {
    if (err) { 
      next(err);
    } else { 
      var vehicle_info = response.data;
      res.json({"vin" : vehicle_info.vin.value, "color" : vehicle_info.color.value,
        "doorCount": vehicle_info.fourDoorSedan.value == 'True' ? 4 : 2, 
        "driveTrain": vehicle_info.driveTrain.value });   
    } 
  });
});

// vehicle doors status endpoint
router.get('/:id/doors', function(req, res, next) {
  var input = { id: req.params.id,  responseType: 'JSON' };
  gm_api(input, 'getSecurityStatusService', function(err, response) {
    if (err) { 
      next(err);
    } else { 
      getVehicleStatusResponse(response.data, function (result) {
        res.json(result); 
      });
    } 
  }); 
});

// vehicle fuel status endpoint
router.get('/:id/fuel', function(req, res, next) {
  var input = { id: req.params.id,  responseType: 'JSON' };
  gm_api(input, 'getEnergyService', function(err, response) {
    if (err) { 
      next(err);
    } else {
      var result = response.data;
      if (result.hasOwnProperty("tankLevel")) {
        res.json({"percent" : result.tankLevel.value == "null" ? 0 
          : parseFloat(result.tankLevel.value)});
      }
      else {
        res.json({"percent" : 0});   
      }
    } 
  }); 
});

// vehicle battery status endpoint
router.get('/:id/battery', function(req, res, next) {
  var input = { id: req.params.id,  responseType: 'JSON' };
  gm_api(input, 'getEnergyService', function(err, response) {
    if (err) { 
      next(err);
    } else {
      var result = response.data;
      if (result.hasOwnProperty("batteryLevel")) {
        res.json({"percent" : result.batteryLevel.value == "null" ? 0 
          : parseFloat(result.batteryLevel.value)});
      }
      else {
        res.json({"percent" : 0});   
      }
    }   
  }); 
});

// vehicle engine status endpoint
router.post('/:id/engine', function(req, res, next) {
  var req_action = '';
  if (req.body.action === 'START') {
    req_action = "START_VEHICLE";
  } else if (req.body.action === 'STOP') {
    req_action = "STOP_VEHICLE";
  }
  if(req_action === '') {
    next({"status" : "400", "reason": "Bad input"});
  } else {
    var input = {id: req.params.id,  command : req_action, responseType: 'JSON'};
    gm_api(input, 'actionEngineService', function(err, result) {
      if (err) { 
        res.json({"status" : "error"});
      } else {
        res.json({"status" : result.actionResult == 'FAILED' ? "error" : "success"});
      }   
    });   
  }   
});

var getVehicleStatusResponse = function (vehicle_status, callback) {
  var dict = [];
  for(var i in vehicle_status.doors.values) {
    var door_status  = vehicle_status.doors.values[i];
    dict.push({"location" : door_status.location.value, 
      "locked" : door_status.locked.value == 'True' ? true : false})
  } 
  callback(dict);
}

var gm_api = function(input, service, cb) { 
  //TODO: this url can be moved to a config
  request.post({url:'http://gmapi.azurewebsites.net/'+ service, json: input}, 
    function optionalCallback(err, httpResponse, body) {
      if (body.status != 200) {
        cb(body, null);       
      } else {
        cb(null, body);
      }
    });
}

module.exports = router;
