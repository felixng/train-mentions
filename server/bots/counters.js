const isDev = process.env.NODE_ENV !== 'production';

var configPath = './config.js';
if (isDev){
	configPath = './localconfig.js'
}

var Twit = require('twit');
var TweetCounter = require('./tweetCounter.js');
var T = new Twit(require(configPath));
var redis = require('redis').createClient(process.env.REDIS_URL || "redis://h:pc8d86cd65c7102d817057135e85213ccdb2e7196eda9a558c96f7b53cbb0ad18@ec2-34-249-251-118.eu-west-1.compute.amazonaws.com:13119");

const theatre = new TweetCounter('theatre', T, redis, 'productions');

module.exports = {
    theatreCounter: theatre,
    // trainCounter: train
};
