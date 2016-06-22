var chai = require('chai');
var should = chai.should();
var request = require('supertest');  
var GM = require("./../models/gm.js");
var expect = chai.expect;
var fs = require('fs');
var path = require('path');

describe('GM model test', function() {

  it('test endpoint', function(done) {      
    var gm = new GM ();
    gm.vehicleInfo.endpoint.should.be.equal("getVehicleInfoService"); 
    gm.doorsStatus.endpoint.should.be.equal("getSecurityStatusService"); 
    gm.batteryStatus.endpoint.should.be.equal("getEnergyService"); 
    gm.fuelStatus.endpoint.should.be.equal("getEnergyService"); 
    gm.engineAction.endpoint.should.be.equal("actionEngineService"); 
    done();
  });

  it('parse input for vehicleInfo', function(done) {      
    var gm = new GM ();
    var input = gm.vehicleInfo.parseInput("1234"); 
    JSON.stringify(input).should.be.equal(JSON.stringify({"id": "1234", "responseType": "JSON"}));
    done();
  });

  it('parse input for doorstatus', function(done) {      
    var gm = new GM ();
    var input = gm.doorsStatus.parseInput("1234"); 
    JSON.stringify(input).should.be.equal(JSON.stringify({"id": "1234", "responseType": "JSON"}));
    done();
  });

  it('parse input for batteryStatus', function(done) {      
    var gm = new GM ();
    var input = gm.batteryStatus.parseInput("1234"); 
    JSON.stringify(input).should.be.equal(JSON.stringify({"id": "1234", "responseType": "JSON"}));
    done();
  });

  it('parse input for fuelStatus', function(done) {      
    var gm = new GM ();
    var input = gm.fuelStatus.parseInput("1234"); 
    JSON.stringify(input).should.be.equal(JSON.stringify({"id": "1234", "responseType": "JSON"}));
    done();
  });

  it('parse input for engineAction', function(done) {      
    var gm = new GM ();
    var input = gm.engineAction.parseInput("123", {"action": "START"}); 
    JSON.stringify(input).should.be.equal(JSON.stringify({"id":"123","command":"START_VEHICLE","responseType":"JSON"}));
    input = gm.engineAction.parseInput("123", {"action": "STOP"});
    JSON.stringify(input).should.be.equal(JSON.stringify({"id":"123","command":"STOP_VEHICLE","responseType":"JSON"}));
    done();
  });

  it('throw error, input for engineAction', function(done) {      
    var gm = new GM ();
    var testFunc = function() {
        gm.engineAction.parseInput("123", {"action": "STATR"});
    };
    expect(testFunc).to.throw(Error);
    done();
  });
  
  it('parse output of vehicleInfo', function(done) {      
    var gm = new GM ();
    fs.readFile('./mocks/gm/vehicleInfoResponse.json', 'utf8', function (err,data) {
      if (err) {
        should.not.throw(err);
      }
      var output = gm.vehicleInfo.parseOutput(JSON.parse(data));
      output.vin.should.be.equal("123123412412");
      output.color.should.be.equal("Black");
      output.doorCount.should.be.equal(4);
      output.driveTrain.should.be.equal("v8");
      done();
    });
  });

  it('parse output of doorsStatus', function(done) {      
    var gm = new GM ();
    fs.readFile('./mocks/gm/doorsStatusResponse.json', 'utf8', function (err,data) {
      if (err) {
        should.not.throw(err);
      }
      var output = gm.doorsStatus.parseOutput(JSON.parse(data));
      output[0].location.should.be.equal("frontLeft");
      output[0].locked.should.be.equal(false);
      output[1].location.should.be.equal("frontRight");
      output[1].locked.should.be.equal(true);   
      done();
    });
  });

  it('parse output of fuelStatus', function(done) {      
    var gm = new GM ();
    fs.readFile('./mocks/gm/energyStatusResponse.json', 'utf8', function (err,data) {
      if (err) {
        should.not.throw(err);
      }
      var output = gm.fuelStatus.parseOutput(JSON.parse(data));
      output.percent.should.be.equal(30);
      done();
    });
  });

  it('parse output of batteryStatus', function(done) {      
    var gm = new GM ();
    fs.readFile('./mocks/gm/energyStatusResponse.json', 'utf8', function (err,data) {
      if (err) {
        should.not.throw(err);
      }
      var output = gm.batteryStatus.parseOutput(JSON.parse(data));
      output.percent.should.be.equal(76);
      done();
    });
  });

  it('parse output of engineSuccessAction', function(done) {      
    var gm = new GM ();
    fs.readFile('./mocks/gm/engineActionSuccessResponse.json', 'utf8', function (err,data) {
      if (err) {
        should.not.throw(err);
      }
      var output = gm.engineAction.parseOutput(JSON.parse(data));
      output.status.should.be.equal("success");
      done();
    });
    
  });

  it('parse output of engineFailedAction', function(done) {      
    var gm = new GM ();
    fs.readFile('./mocks/gm/engineActionFailedResponse.json', 'utf8', function (err,data) {
      if (err) {
        should.not.throw(err);
      }
      var output = gm.engineAction.parseOutput(JSON.parse(data));
      output.status.should.be.equal("error");
      done();
    });
    
  });

  it('throw error on empty engineFailedAction', function(done) {      
    var gm = new GM ();
    var testFunc = function() {
        gm.engineAction.parseOutput({});
    }
    expect(testFunc).to.throw(Error);
    done();
    
  });

  it('throw error on empty batteryStatus', function(done) {      
    var gm = new GM ();
    var testFunc = function() {
        gm.batteryStatus.parseOutput({});
    }
    expect(testFunc).to.throw(Error);
    done();
    
  });

  it('throw error on empty fuelStatus', function(done) {      
    var gm = new GM ();
    var testFunc = function() {
        gm.fuelStatus.parseOutput({});
    }
    expect(testFunc).to.throw(Error);
    done();
    
  });


});