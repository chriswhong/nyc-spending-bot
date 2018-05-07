const Twitter = require('twitter');

require('dotenv').config();

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const sendTweet = (status) => {
  console.log(`Tweeting...`);
  console.log(status);
  client.post('statuses/update', { status }, (error, tweet, response) => {
    if (error) {
      console.log(error);
      throw error;
    }
  });
};

const sendTweets = (tweetStrings) => {
  console.log(`Preparing to send ${tweetStrings.length} tweets over 8 hours`);
  sendTweet(tweetStrings[0]);

  // spread the tweets out over 8 hours
  const seconds = 28800 / tweetStrings.length;
  const interval = seconds * 1000;

  let i = 1;

  console.log(`Waiting ${seconds} seconds to tweet again...`)
  const tweetInterval = setInterval(() => {

    if (i < tweetStrings.length) {
      sendTweet(tweetStrings[i]);
      i += 1;
    } else {
      clearInterval(tweetInterval);
    }
  }, interval);
};

module.exports = sendTweets;
