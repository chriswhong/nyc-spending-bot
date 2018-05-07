const transactions = require('./test-transactions.json');
const tweetSequence = require('./tweet-sequence');

tweetSequence([transactions[15], transactions[16], transactions[17]], '2018-05-02');
