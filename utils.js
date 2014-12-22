var dotenv = require('dotenv');
dotenv.load();

var request = require('request');
var Qs = require('qs');


module.exports = {
	springSearch: function(cq, hpp, cb){
		var clean_query = cq.replace(/\'/g, '\\\'');
		var p = {
			query: clean_query,
			hitsPerPage: hpp.toString(),
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
				cb(body);
			}
			else{
				cb(500);
			}
		});
	}
}