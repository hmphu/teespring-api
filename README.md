[Unofficial] Teespring API
===========================

If you want a really simple way to access Teespring campaigns from your own apps.



####/v01/[campaign-name]
For example: http://teespring-api.cloudapp.net/v01/tudev

Returns JSON with everything you want!
```
{  
   "status":"ok",
   "tee":"tudev",
   "url":"http://teespring.com/tudev",
   "images":{  
      "front":"http://images.teespring.com/shirt_pic/1467090/1305561/222/5484/front.jpg?v=2014-10-21-08-27",
      "back":"http://images.teespring.com/shirt_pic/1467090/1305561/222/5484/back.jpg?v=2014-10-21-08-27"
   },
   "total_sold":"5",
   "goal_amount":"25",
   "goal_date":"2014-11-12T04:00:00Z",
   "details":"Temple Dev is Temple University's student-run software engineering organization."
}
```

####/v01/search/[any search query]
For example: http://teespring-api.cloudapp.net/v01/search/tudev

Returns JSON with hits from the Teespring search*. Each hits[] will contain individual JSON objects for each resulting tee.
```
{
   hits: [ ],
   nbHits: 0,
   page: 0,
   nbPages: 0,
   query: "sample search query",
}
```
*Information about how this was achieved can be found [here](https://medium.com/@SamuelCouch/hidden-in-plain-sign-221ebc7cf47a).

Built with ♥ by Sam Couch.

####Not affiliated with [Teespring](http://www.teespring.com), but they're awesome. Check them out!
