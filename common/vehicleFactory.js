'use strict'
var GM = require("./../models/gm.js");

//attempt to wrtie JS factory pattern to return instance of a car
var VehicleFactory = function () {
  this.gm = new GM();
};

VehicleFactory.prototype.getVehicle = function(vinNumber) {
  var vehicle = vehicleType(vinNumber);
  switch(vehicle) {
    case 'GM' :
        return this.gm;
    default :
        throw new Error("cannot find car manufacturer");   
  }  
};

var vehicleType = function(vinNumber) {
    //use some mechanism to get car type from vin
    return 'GM';
};

module.exports = VehicleFactory;