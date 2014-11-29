// BASE SETUP
// =============================================================================

var dotenv = require('dotenv');
dotenv.load();
var request = require('request');
var cheerio = require('cheerio');
var logger = require('morgan');
var path    = require('path');
var favicon = require('serve-favicon');
var express    = require('express');
var bodyParser = require('body-parser');
var Qs = require('qs');
var app        = express();

var springSearch = require('./utils').springSearch;

//var client = require('redis').createClient();
//var limiter = require('express-limiter')(app, client);

// configure app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

var port     = process.env.PORT || 3000;

// ROUTES FOR OUR API
// =============================================================================

app.get('/v01/:campaign', function(req, res){
	var query = req.params.campaign;
	query = query.toLowerCase();
	springSearch(query, 1, function(result){
		if(query === result.hits[0].url){
			var cleaned = {
				status: "ok",
				tee: result.hits[0].url,
				url: "http://teespring.com/"+result.hits[0].url,
				images: {
					front: result.hits[0].primary_pic_url,
					back: result.hits[0].secondary_pic_url
				},
				toal_sold: result.hits[0].ordered,
				goal: result.hits[0].tippingpoint,
				goal_date: result.hits[0].enddate,
				details: result.hits[0].description.trim().replace(/[^\u0000-\u007F]/g, ' ')
			}
			res.status(200).json(cleaned);
		}
		else if(query == 500){
			res.status(500).json({
				status: 500,
				message: "Looks like something went wrong on our end, sorry about that!"
			});
		}
		else{
			res.status(400).json({
				status: 400,
				message: "Looks like that campaign doesn\'t exist. Sorry!"
			});
		}
	});
});

app.get('/v02/:campaign', function(req, res){
	var query = req.params.campaign;
	query = query.toLowerCase();
	springSearch(query, 1, function(result){
		if(query === result.hits[0].url){
			result.hits[0].description = result.hits[0].description.trim().replace(/[^\u0000-\u007F]/g, ' ');
			result.hits[0].status = "ok";
			res.status(200).json(result.hits[0]);
		}
		else if(query == 500){
			res.status(500).json({
				status: 500,
				message: "Looks like something went wrong on our end, sorry about that!"
			});
		}
		else{
			res.status(400).json({
				status: 400,
				message: "Looks like that campaign doesn\'t exist. Sorry!"
			});
		}
	});
});

app.get('/v01/search/:campaign_search', function(req, res){
	var query = req.params.campaign_search;
	springSearch(query, 10000, function(result){
		if(result == 500){
			res.status(500).json({
				status: 500,
				message: "Looks like something went wrong on our end, sorry about that!"
			});
		}
		else{
			result.hits.status = 200;
			result.hits.message = "OK";
			res.status(200).json(result);
		}
	});
});

app.get('/v02/search/:campaign_search', function(req, res){
	var query = req.params.campaign_search;
	springSearch(query, 10000, function(result){
		if(result == 500){
			res.status(500).json({
				status: 500,
				message: "Looks like something went wrong on our end, sorry about that!"
			});
		}
		else{
			result.hits.status = 200;
			result.hits.message = "OK";
			res.status(200).json(result);
		}
	});
});

app.get('/', function(req, res){
	res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('The unicorns are running wild on port %d!', port);