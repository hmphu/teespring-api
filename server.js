// BASE SETUP
// =============================================================================

// call the packages we need
var request = require('request');
var cheerio = require('cheerio');
var logger = require('morgan');
var path    = require('path');
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

// configure app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

var port     = process.env.PORT || 3000;

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
		var details = $('div.description.hidden-sm.hidden-xs').text().trim();
		if(err){
			res.status(400).json({
				message: "There seems to have been an error, double check your request."
			});
		}
		else {
			res.status(200).json({
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

app.get('/', function(req, res){
	res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('The unicorns are running wild on port %d!', port);
