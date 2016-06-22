var request = require('request');

var requestApi = function(input, url, cb) { 
  request.post({url: url, json: input}, 
    function optionalCallback(err, httpResponse, body) {
      if (err) {
        cb(err, null);
      } else if (body.status != 200) {
        cb(body, null);       
      }else {
        cb(null, body);
      }
    });
}

module.exports = requestApi;