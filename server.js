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
//var client = require('redis').createClient();
//var limiter = require('express-limiter')(app, client);

// configure app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

var port     = process.env.PORT || 3000;

// limiter({
//   path: '/v01/:tee_title',
//   method: 'get',
//   lookup: ['connection.remoteAddress'],
//   // 150 requests per hour
//   total: 150,
//   expire: 1000 * 60 * 60
// });

// ROUTES FOR OUR API
// =============================================================================
app.get('/v01/:tee_title', function(req, res){
	var url = "http://teespring.com/" + req.params.tee_title;
	var err = [];
	request(url, function(err, resp, body){
		var $ = cheerio.load(body);
		var front_img_url = $('img.main_campaign_image').attr('src');
		var back_img_url = $('img.back').attr('src');
		var sold = $('h4.clean.visible-sm span.amount-ordered').text();
		var goal = $('h4.clean.visible-sm span.goal').text();
		var goal_date = $('div.time-left').attr('title');
		var details = $('div.description.hidden-sm.hidden-xs').text().trim().replace(/[^\u0000-\u007F]/g, ' ');
		if($('body.page__errors_error_404').length){
			res.status(400).json({
				status: "error",
				message: "Looks like the campaign you requested may not exists..."
			});
		}
		else if(err){
			res.status(500).json({
				status: "danger",
				message: "There seems to be a problem, sorry about that."
			});
		}
		else {
			res.status(200).json({
				status: 'ok', 
				tee: req.params.tee_title,
				url: url,
				images:{ front: front_img_url,
						 back: back_img_url	
						},
				total_sold: sold,
				goal_amount: goal,
				goal_date: goal_date,
				details: details
			});
		}
	});
});

app.get('/v01/search/:tee_query', function(req, res){
	var clean_query = req.params.tee_query.replace(/\'/g, '\\\'');
	var p = {
			query: clean_query,
			hitsPerPage: '1000',
			restrictSearchableAttributes: '["name", "url", "description", "tag_names", "front_text", "back_text", "id"]',
			numericFilters: '["publicly_searchable=1"]',
			page: '0'
		};
	var api_request = {
		url: process.env.ALGOLIA_URL,
		method: 'POST',
		json: {
			"params": Qs.stringify(p),
			"apiKey": process.env.ALGOLIA_API_KEY,
			"appID": process.env.ALGOLIA_APP_ID
		}
	};

	request(api_request, function (err, resp, body) {
		if (!err){
			res.status(200).send(body).end();
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