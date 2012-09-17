var http = require('http'),
    url = require('url'),
    xml2js = require('xml2js'),
    util = require('util'),
    conf = require('./config.js'),
    myConf = require('./myConf.js');

var parser = new xml2js.Parser();

// set up url with api key
var path = conf.path.replace('{token}', myConf.api);

var onRequest = function (req, res) {
	console.log("running");
	var pathname = url.parse(req.url).pathname;
	console.log(pathname + " was requested");
	res.writeHead(200, {'Content-Type':'text/plain'});
	getBusData(pathname.substr(1,pathname.length), res);
};

var getBusData = function (stopId, mainRes) {
  var options = {
    host : conf.host,
    port : conf.port,
    path : path.replace('{stopId}', stopId)
  }

	http.get(options, function (res){
		res.setEncoding('utf8');
		res.on('data', function (chunk){
			parser.parseString(chunk, function(err, result) {
				var header =  ""
							+ " /==============\\\n"
							+ "| Stop ID: " + stopId + " |\n"
							+ " \\==============/\n\n";
				mainRes.write(header);
        try {
          var routes = result['AgencyList']['Agency']['RouteList']['Route'];
          for (var i in routes) {
            var route = routes[i];
            var departureTimeList = route["RouteDirectionList"]["RouteDirection"]["StopList"]["Stop"]["DepartureTimeList"];
            var departureTimes = departureTimeList["DepartureTime"];
            if (departureTimes != undefined) {
              var respStr = ""
              respStr += route["@"]["Name"] + "\n";
              respStr += "===\n";
              respStr += "coming in ... \n";
              for (var j in departureTimes) {
                var spaces = "              ";
                respStr += spaces + departureTimes[j];
                respStr += " minute";
                if (departureTimes[j] != "1") {
                  respStr += "s";
                }
                respStr += "\n";
              }
              respStr += "\n\n\n";
              mainRes.write(respStr);
            }
            //mainRes.write(departureTimeList);
          }
        } catch (e) {
          mainRes.write("There was an error in getting this data. Please try again later, sorry!");
          console.log("Error getting data for stop code " + stopId + " at " + new Date());
          console.log("511's API returned ", result);
          console.log("Make sure you have entered an API key");
        }
			});
		});
		res.on('end', function () {
			mainRes.end();
		});
	}).on("error", function(e){
		console.log("Got error: " + e.message);
		mainRes.end();
	});
}

http.createServer(onRequest).listen(myConf.port,'127.0.0.1');

console.log('Server running at 127.0.0.1:1337/');
