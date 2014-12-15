var assert = require("assert");
var sinon = require("sinon");
sinon.assert.expose(assert,{prefix:""})
var request = require("../../lib/scraper/request");



describe("scraper#request()",function(){
	var _request1,_request2,_request3;

	beforeEach(function(){
		_request1 = sinon.stub();
		_request1.callsArgWith(1,null,{statusCode:200,body:"body"});
		_request2 = sinon.stub();
		_request2.callsArgWith(1,null,{statusCode:404,body:"body"});
		_request3 = sinon.stub();
		_request3.callsArgWith(1,"UNERROR");
	});

	it("should call request correctly",function(done){
		request._request = _request1;
		var successCb = sinon.spy();
		request("url")
		.then(successCb)
		.done(function(){
			assert.calledOnce(_request1);
			assert.calledWith(_request1,"url");
			assert.calledOnce(successCb);
			assert.calledWith(successCb,sinon.match({body:"body"}))

			done();
		});
	});
	it("should call error when statusCode is not 200",function(done){
		request._request = _request2;
		var successCb = sinon.spy();
		request("url")
		.then(successCb,function(error){
			assert.equal(error.code,"EHTTPSTATUS");
		})
		.done(function(){
			assert.calledOnce(_request2);
			assert.calledWith(_request2,"url");

			done();
		});
	});
	it("should call error cb when unexpected error",function(done){
		request._request = _request3;
		var successCb = sinon.spy();

		request("url")
		.then(successCb,function(error){
			assert.equal(error,"UNERROR");
		})
		.done(function(){
			assert.calledOnce(_request3);
			assert.calledWith(_request3,"url");

			done();
		});
	});
});
