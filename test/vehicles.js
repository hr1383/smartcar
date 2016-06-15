var chai = require('chai');
var should = chai.should();
var assert = require('assert');
var request = require('supertest');  
//TODO: this url can be moved to a config
var url = "http://localhost:8080"   

describe('Smartcar API test', function() {

  it('should return vehicle info', function(done) {      
    request(url)
    .get('/vehicles/1234')
    .end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.vin.should.be.equal("123123412412");
      res.body.color.should.be.equal("Metallic Silver");
      res.body.doorCount.should.be.equal(4);
      res.body.driveTrain.should.be.equal("v8");
      done();
    });
  });

  it('should not return vehicle info', function(done) {      
    request(url)
    .get('/vehicles/123334')
    .end(function(err, res) {
      res.status.should.be.equal(404); 
      res.body.reason.should.be.equal("Vehicle id: 123334 not found.");        
      done();
    });
  });

  it('passing bad url', function(done) {      
    request(url)
    .get('/vehiclse/123334')
    .end(function(err, res) {
      res.status.should.be.equal(404); 
      done();
    });
  });

  it('should return vehicle doors status', function(done) {      
    request(url)
    .get('/vehicles/1235/doors')
    .end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.length.should.be.equal(2);
      done();
    });
  });

  it('should not return vehicle doors status', function(done) {      
    request(url)
    .get('/vehicles/123334/doors')
    .end(function(err, res) {
      res.status.should.be.equal(404); 
      res.body.reason.should.be.equal("Vehicle id: 123334 not found.");        
      done();
    });
  });

  it('should return vehicle fuel as 0', function(done) {      
    request(url)
    .get('/vehicles/1235/fuel')
    .end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.percent.should.be.equal(0);
      done();
    });
  });

  it('should return vehicle fuel percent', function(done) {      
    request(url)
    .get('/vehicles/1234/fuel')
    .end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property("percent");
      done();
    });
  });

  it('should not return vehicle fuel percent', function(done) {      
    request(url)
    .get('/vehicles/123334/fuel')
    .end(function(err, res) {
      res.status.should.be.equal(404); 
      res.body.reason.should.be.equal("Vehicle id: 123334 not found.");        
      done();
    });
  });

  it('should return vehicle battery percent', function(done) {      
    request(url)
    .get('/vehicles/1235/battery')
    .end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property("percent");
      done();
    });
  });

  it('should not return vehicle battery percent', function(done) {      
    request(url)
    .get('/vehicles/1234/battery')
    .end(function(err, res) {
      res.status.should.be.equal(200); 
      res.body.percent.should.be.equal(0);        
      done();
    });
  });

  it('should return vehicle engine status', function(done) {      
    request(url)
    .post('/vehicles/1234/engine')
    .send({"action": "START"})
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property("status");
      done();
    });
  });

  it('should return bad output for wrong action', function(done) {      
    request(url)
    .post('/vehicles/1234/engine')
    .send({"action": "STATR"})
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      res.status.should.be.equal(400);
      done();
    });
  });    
});

