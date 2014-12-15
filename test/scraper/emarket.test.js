var emarket = require("../../lib/scraper/emarket");
var request = require("../../lib/scraper/request");
var assert = require("assert");
var sinon = require("sinon");
var Q = require("Q");
var fs = require("fs");
sinon.assert.expose(assert,{prefix:""})



describe("scraper.emarket",function(){
	var _request1,_request2,_params1,_params2,_expectedUrl;
	beforeEach(function(){
		_request1 = sinon.stub();
		_request1.returns(Q.Promise(function(resolve){
			var html = fs.readFileSync(__dirname + '/data/emarket/results.html');
			resolve({
				body:html
			});
		}));
		_request2 = sinon.stub();
		_request2.returns(Q.Promise(function(resolve,reject){
			reject("UNERROR");
		}));

		_params1 = {
			query:"honda civic",
			requestFn:_request1
		};
		_params2 = {
			query:"honda civic",
			requestFn:_request2
		};

		_expectedUrl = "http://emarket.com.do/anuncio/buscar.html?q=honda%20civic";

	});

	describe("#search()",function(){
		it("should emit result and done event",function(done){
			var resultCb = sinon.spy();
			var errorCb = sinon.spy();

			emarket.search(_params1)
			.on("result",resultCb)
			.on("error",errorCb)
			.on("done",function(){
				//console.log("EO");
				assert.calledOnce(_request1);
				assert.calledWith(_request1,_expectedUrl);
				assert.equal(resultCb.callCount,26);
				assert.calledWith(resultCb,sinon.match({ 
					url: 'http://emarket.com.do/anuncio/vendo-honda-civic-2005-blanco-5016138?results=1.html',
					title: 'vendo honda Civic 2005 blanco ' } 
				));
				assert.equal(errorCb.callCount,0);			
				

				done();
			});
		});
		it("should emit error and done event",function(done){
			var resultCb = sinon.spy();
			var errorCb = sinon.spy();

			emarket.search(_params2)
			.on("result",resultCb)
			.on("error",errorCb)
			.on("done",function(){
				assert.calledOnce(_request2);
				assert.calledWith(_request2,_expectedUrl);

				assert.equal(resultCb.callCount,0);

				assert.equal(errorCb.callCount,1);	
				assert.calledWith(errorCb,"UNERROR");		

				done();
			});
		});
	});
});