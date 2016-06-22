'use strict'
var Car = require("./cars.js");

// GM extends Car
 var GM  = function () {
  Car.call(this);
  this.hostUrl = "http://gmapi.azurewebsites.net/";
  this.vehicleInfo = new GMVehicleInfo(this.hostUrl);
  this.doorsStatus =new GMDoorStatus(this.hostUrl);
  this.fuelStatus = new GMFuelStatus(this.hostUrl);
  this.batteryStatus = new GMBatteryStatus(this.hostUrl);
  this.engineAction = new GMEngineAction(this.hostUrl);  
} ;

GM.prototype = Object.create(Car.prototype);
GM.prototype.constructor = GM;

var GMVehicleInfo = function(hostUrl) {
    this.endpoint = "getVehicleInfoService";
    this.url = hostUrl + this.endpoint;
    this.parseInput = function(vinNumber) {
      return requestJson(vinNumber);
    };
    this.parseOutput = function(result) {
      result = result.data;
      var info = {};
      if (result.hasOwnProperty("vin")) {
        info['vin'] = result.vin.value;
      }
      if (result.hasOwnProperty("color")) {
        info['color'] = result.color.value;
      }
      if (result.hasOwnProperty("fourDoorSedan")) {
        info['doorCount'] = result.fourDoorSedan.value == 'True' ? 4 : 2;
      }
      if (result.hasOwnProperty("driveTrain")) {
        info['driveTrain'] = result.driveTrain.value;
      }
      return info;
    }
};

var GMDoorStatus = function(hostUrl) {
    this.endpoint = "getSecurityStatusService";
    this.url = hostUrl + this.endpoint;
    this.parseInput = function(vinNumber) {
      return requestJson(vinNumber);
    }
    this.parseOutput = function(result) {
      result = result.data;
      var dict = [];
      for(var i in result.doors.values) {
          var doorStatus  = result.doors.values[i];
          dict.push({"location" : doorStatus.location.value, 
            "locked" : doorStatus.locked.value == 'True' ? true : false})
      } 
      return dict;
    }
}

var GMFuelStatus = function(hostUrl) {
    this.endpoint = "getEnergyService";
    this.url = hostUrl + this.endpoint
    this.parseInput = function(vinNumber) {
      return requestJson(vinNumber);
    }
    this.parseOutput = function(result) {
      result = result.data;
      if (result.hasOwnProperty("tankLevel")) {
          return ({"percent" : result.tankLevel.value == "null" ? 0 
              : parseFloat(result.tankLevel.value)});
      } 
      throw new Error("received invalid response");
    }
};

var GMBatteryStatus = function(hostUrl) {
    this.endpoint = "getEnergyService";
    this.url = hostUrl + this.endpoint;
    this.parseInput = function(vinNumber) {
      return requestJson(vinNumber);
    }
    this.parseOutput = function(result) {
      result = result.data;
      if (result.hasOwnProperty("batteryLevel")) {
          return {"percent" : result.batteryLevel.value == "null" ? 0 
                  : parseFloat(result.batteryLevel.value)};
      } 
      throw new Error("received invalid response");
    }
};

var GMEngineAction = function (hostUrl) {
    this.endpoint = "actionEngineService";
    this.url = hostUrl + this.endpoint;
    this.parseInput = function (vinNumber, body) {
      var requestedAction = ''
      var action = body['action'];
      if (action === 'START') {
        requestedAction = 'START_VEHICLE';
      } else if (action === 'STOP') {
        requestedAction = 'STOP_VEHICLE';
      } else {
        throw new Error("input action is not valid");
      }
      return { id: vinNumber,  "command" : requestedAction, responseType: 'JSON' };
    }
    this.parseOutput = function(result) {
      if(result.hasOwnProperty("actionResult")) {
        return {"status" : result.actionResult.status === "EXECUTED" ? "success" : "error"};
      };
      throw new Error("received invalid response");
    };
};

var requestJson = function(vinNumber) {
  return { id: vinNumber,  responseType: 'JSON'};
};


module.exports = GM;
