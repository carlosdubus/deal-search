var cheerio = require("cheerio");
var request = require("./request");
var extend = require("extend");
var EventEmitter = require("events").EventEmitter;

function parseResults(htmlResults,emitter){
	var $ = cheerio.load(htmlResults);
	$("ul.search-result li").each(function(){
		var result = {
			url:$(this).find("a").attr("href"),
			title:$(this).find("span").text()
		};
		emitter.emit("result",result);
	});

}


function newSearchRequest(params){
	params = extend({requestFn:request},params);

	return params.requestFn('http://emarket.com.do/anuncio/buscar.html?q='+encodeURIComponent(params.query));
}

function EmarketScraper(params){
	extend(this,{requestFn:request},params);
}

EmarketScraper.prototype = {
	search:function(){
		var emitter = new EventEmitter();
		newSearchRequest(this)
		.then(function(response){
			parseResults(response.body,emitter);
		},function(error){
			emitter.emit("error",error);
		})
		.done(function(){
			emitter.emit("done");
		});
		return emitter;
	}
};

module.exports = {
	EmarketScraper:EmarketScraper,
	search:function search(params){
		return new EmarketScraper(params).search();
	}
}