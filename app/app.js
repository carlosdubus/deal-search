var express = require('express');
var app = express();
var scraper = require("../lib/scraper");
 
app.get('/', function(request, response) {
    response.sendFile(__dirname+"/index.html");
});

io.on("search",function(){
	scraper.sites.forAll(function(site){
		site.search(query)
		.on("result",function(result){
			socket.emit("result",result)
		})
		.on("done",function(){
			socket.emit("done");
		})
	})
});

app.listen(3000);