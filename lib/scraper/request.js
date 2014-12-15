var request = require("request");
var Q = require("Q");
/*var e = require("./error");

function newRequestHandler(cb,processor) {
	return function (error, response, body){
		if(error){
			return cb(error);
		}

		if (response.statusCode != 200) {
			return cb(e.wrongHttpStatusCode(response,body));
		}

		cb(null,processor(body));
	}
}*/

function exception(msg,code){
	var e = new Error(msg);
	e.code = code;
	return e;
}

var newRequest = function(url){
	return Q.Promise(function(resolve,reject){
		newRequest._request(url,function(error,response,body){
			
			if(error){
				return reject(error);
			}

			if (response.statusCode != 200) {
				return reject(exception("http status code is not 200","EHTTPSTATUS"));
			}

			resolve(response);
		});
	});
};

newRequest._request = request;

module.exports = newRequest;