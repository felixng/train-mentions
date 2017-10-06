function TweetCounter(T, TWriter, redis, tableName) {
    const ignore = ['e_n_o', 'enballet', 'the_globe', 'sadlers_wells', 'menchocfactory', 'openairtheatre', 'youngvictheatre', 'oldvictheatre', 'lyrichammer', 'nationaltheatre', '', null];
    var fs = require('fs');
    var http = require("http");
    var sleep = require('sleep');
    var mongo = require('./db/mongo');

    const isDev = process.env.NODE_ENV !== 'production';
    // const url = process.env.API_URL || 'uat-cms-ensemblr.herokuapp.com';
    const googleQuery = process.env.GOOGLE_QUERY || 'id=1cM9FHR5-BjLJFh9CurAVtfL2MVg73mEzCnD_pvf2ZDQ'
    const spreadsheet = 'https://spreadsheets.google.com/feeds/list/1cM9FHR5-BjLJFh9CurAVtfL2MVg73mEzCnD_pvf2ZDQ/1/public/full?alt=json'

    var includeRetweet = process.env.INCLUDE_RETWEET || true;
    var retweetWeight = process.env.RETWEET_WEIGHT || 0.3;
    var favWeight = process.env.FAV_WEIGHT || 0.1;

    if (isDev){
        fs.unlink("tweet.json", function(){
            console.log("Cleaning up disk tweet file.")
        });
    };

    function toDateKey(date){
        return date.toJSON().slice(0,10).replace(/-/g,'-');
    }

    //Parsing Dates: Yesterday and the Day Before
    function parseDateQuery(daysAgo = 0, length = 1, callback){
        var date = new Date();
        date.setDate(date.getDate() - daysAgo);
        var untilDate = date.toJSON().slice(0,10).replace(/-/g,'-');
        console.log("Until: " + untilDate);

        date.setDate(date.getDate() - length);
        var sinceDate = date.toJSON().slice(0,10).replace(/-/g,'-');
        console.log("Since: " + sinceDate);

        var since = " since:" + sinceDate;
        var until = " until:" + untilDate;

        var dateOptions = {
            daysAgo: daysAgo,
            length: length,
            query: since + until
        }

        callback(dateOptions);
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    function resetCounts(){
        console.log('Resetting Count');
        tweetTotal = 0;
        retweetTotal = 0;
        score = 0;
    }

    function parseResult(logConfig, tally, callback){
        var handle = logConfig.handle;
        // var daysAgo = logConfig.daysAgo;
        // var duration = logConfig.duration;
        var tweetTotal = tally.tweetTotal;
        var retweetTotal = tally.retweetTotal;
        var favTotal = tally.favTotal;
        var score = Math.round(tweetTotal + (retweetTotal * retweetWeight) + (favTotal * favWeight));

        var keyDate = new Date();
        keyDate.setDate(keyDate.getDate() - tally.daysAgo - 1);
        var keyDateString = keyDate.toJSON().slice(0,10).replace(/-/g,'-');

        var result = {
            id: logConfig.id,
            date: keyDateString,
            name: logConfig.name,
            handle: logConfig.handle,
            tweetTotal: tweetTotal,
            retweetTotal: retweetTotal,
            favouriteTotal: favTotal,
            score: score,
            tweets: tally.tweetIds,
            createdAt: new Date(), 
        }

        callback(result);
    }

    function logToMongo(result){
        mongo.insert(result);
    }

    function getJSON(options, onResult)
    {
        console.log("rest::getJSON");

        var port = options.port == 443 ? https : http;
        var req = port.request(options, function(res)
        {
            var output = '';
            //console.log(options.host + ':' + res.statusCode);
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                output += chunk;
            });

            res.on('end', function() {
                var obj = JSON.parse(output);
                onResult(res.statusCode, obj);
            });
        });

        req.on('error', function(err) {
            console.log(err);
        });

        req.end();
    };

    function logToFile(data){
        if (isDev){
            var json = JSON.stringify(data,null,2);
            
            fs.appendFile("tweet.json", json, function(){
                console.log("Twitter reply wrote to disk.")
            });
        }
    }

    function calculateTweets(tweets, tally) {
        if (tweets.statuses){
            tally.tweetTotal += tweets.statuses.length;

            tweets.statuses.forEach( (tweet) => {
                tally.retweetTotal += tweet.retweet_count;
                tally.favTotal += tweet.favorite_count;
                tally.tweetIds.push(tweet.id_str);
            });
        }
    };

    // function getProductionsFromAPI(callback){
    //     var options = {
    //       hostname: url,
    //       path: '/api/productions/twitters',
    //       method: 'GET',
    //       headers: { 'Content-Type': 'application/json' }
    //     };

    //     getJSON(options, function(status, result) {
    //         callback(result);
    //     });
    // }

    var getTweetChunk = function myself (tally, max_id) {
        return new Promise( (resolve, reject) => {
            var nextSearch = tally.query;
            if (max_id){
                nextSearch.max_id = max_id;
            }

            T.get('search/tweets', nextSearch, function(error, data) {
                if (error){
                    // console.log(error);
                    if (error.twitterReply){
                        console.log(error.twitterReply.errors);    
                    }
                    sleep.sleep(900);
                }
                else if (data.errors){
                    // console.log(data.errors);
                    if (data.errors.twitterReply){
                        console.log(data.errors.twitterReply.errors);    
                    }
                    sleep.sleep(900);
                }
                else {
                    logToFile(data);
                    calculateTweets(data, tally);
                    resolve(data);
                }
            })
        })
        .then( data => {
            if ( data.statuses && data.statuses.length > 98) {
                return myself(tally, data.statuses[data.statuses.length - 1].id);
            }
        });
    };

    function run(provider, dateOptions){
        var date = dateOptions.query;
        var handle = provider.handle;
        var tweetTotal = 0;
        var favTotal = 0;
        var retweetTotal = 0;
        var query = { q: handle + date + ' -filter:retweets',
                       geocode: "51.528308,-0.3817765,500mi", 
                       count: 99,
                       result_type: "recent", 
                       lang: 'en', 
                       include_entities: false,
                       result_type: 'recent' };
        
        var logConfig = {
            id: provider.id,
            handle: handle, 
            name: provider.name
        }

        var tally = {
            query: query,
            tweetTotal: tweetTotal,
            retweetTotal: retweetTotal,
            favTotal: favTotal,
            daysAgo: dateOptions.daysAgo,
            length: dateOptions.length,
            tweetIds: [],
        }

        return new Promise( (resolve, reject) => {
            var promise = getTweetChunk(tally, null);

            Promise.all([promise]).then(values => { 
              resolve();
            });
        })
        .then(function(){
            parseResult(logConfig, tally, function(result){
                logToMongo(result);
            });
            resetCounts();
        })
    };

    this.gatherAll = function(){
        this.gatherAllDuration(0, 1);
    }

    this.gatherAllDuration = function(daysAgo, duration){
        parseDateQuery(daysAgo, duration, function(dateOptions){
            getHandles(function(providers){
                providers.forEach(function(provider){
                    if (provider.handle && !ignore.includes(provider.handle.toLowerCase()) && provider.handle != null){
                        run(provider, dateOptions);
                    }
                    else{
                        console.log("Ignoring ", provider.handle);
                    }
                });
            });    
        });
    }

    function getHandles(callback){
        var options = {
          hostname: 'gsx2json.com',
          path: '/api?' + googleQuery,
          // hostname: 'https://spreadsheets.google.com',
          // path: '/feeds/list/1cM9FHR5-BjLJFh9CurAVtfL2MVg73mEzCnD_pvf2ZDQ/1/public/full?alt=json',
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        };

        // var handles = []

        // console.log(options.path);

        getJSON(options, function(status, result) {
            if (result && result.rows && result.rows.length > 0){
                var providers = result.rows;

                // var providers = JSON.stringify(rows);

                
                
                // for (var i = 0; i < rows.length; i++){
                //     if (rows[i].tocrawl &&
                //         rows[i].twitter && 
                //         rows[i].twitter != '' &&
                //         rows[i].twitter != '-') {
                        
                //         if (!rows[i].twitter.startsWith('#')){
                //             rows[i].twitter = '@' + rows[i].twitter;
                //         }

                //         handles.push(rows[i].twitter);
                //     }
                // }
            }

            callback(providers);
        });
    }

    this.getYesterdayRankingTweetText = function(){
        var date = new Date();
        date.setDate(date.getDate() - 1);

        mongo.list(toDateKey(date), 5, function(list){
            // console.log(list);
            var top5 = list.map(function(item) {
               return { handle: '@' + item.handle,
                        tweets: item.tweetTotal,
                        retweets: item.retweetTotal,
                        favourite: item.favouriteTotal };
            });

            var top5Handles = list.map(function(item) {
               // return '@' + item.handle;
               return item.handle;
            });

            console.log(top5Handles);

            var status = 'The Top 5 Tweet Buzzing Train Companies, on ' + toDateKey(date) + ' are: ' + top5Handles.join(', ');
            //Template for different statuses and fit in ranking sequence.
            // Ranking for today..etc

            console.log(status);
            TWriter.post('statuses/update', { status: status }, function(err, data, response) {
                console.log(data);
            });

        })
    }

}

module.exports = TweetCounter;