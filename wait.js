var fs = require("fs");
var http = require("http");
var path = require("path");
var interval = setInterval(function() {
  console.log("trying " + path.resolve(__dirname, "./serverBuild/index.js"));
  fs.exists(path.resolve(__dirname, "./serverBuild/index.js"), function(exists) {
    exists && clearInterval(interval);
  });
}, 1000);
[
  4572 //s3
].forEach(function(port) {
  var interval = setInterval(function() {
    console.log("trying " + port);
    var request = http.request({
      port: port,
      hostname: 'localstack',
      method: 'GET'
    }, function(res) {      
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        console.log(`BODY: ${chunk}`);
      });
      res.on('end', function() {
        console.log('No more data in response.');
        clearInterval(interval);
      });
    });
    request.on('error', function(e) {
      console.error(`problem with request: ${e.message}`);
    });
    request.end();
  }, 1000);
})