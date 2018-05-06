const _ = require('underscore');
const numeral = require('numeral');
const moment = require('moment');
const toTitleCase = require('./to-title-case');
const sendTweet = require('./send-tweet');
const agencyIdLookup = require('./agency-id-lookup.json');

toTitleCase();

const summarizeByAgency = (transactions) => {
  const grouped = _.groupBy(transactions, d => d.agency);
  const mapped = _.mapObject(grouped, val => ({
    transactions: val.length,
    sum: _.reduce(val, (memo, d) => memo + parseFloat(d.check_amount), 0),
    categories: _.uniq(val, d => d.expense_category).map(d => d.expense_category),
  }));

  return mapped;
};

const stringifyAgencySummaries = (agencySummaries, dateString) => Object.keys(agencySummaries)
  .map((key) => {
    const d = agencySummaries[key];
    const { sum, transactions, categories } = d;
    const normalizedCategories = categories.map(c => c.toTitleCase());
    const printCategories = normalizedCategories.map(n => `'${n}'`).join(', ');

    const id = agencyIdLookup[key];
    const hyperlink = `https://www.checkbooknyc.com/spending/search/transactions/agency/${id}/chkdate/${dateString}~${dateString}`;

    return `On ${moment(dateString).format('MMMM D0')}, the ${key} had ${transactions} spending transaction${transactions > 1 ? 's' : ''} totalling ${numeral(sum).format('$0,0.00')}. Categories included ${printCategories} ${hyperlink}`;
  });

const sendTweets = (transactions, dateString) => {
  const agencySummaries = summarizeByAgency(transactions);
  const agencySummaryStrings = stringifyAgencySummaries(agencySummaries, dateString);

  console.log(agencySummaryStrings);

  // sendTweet(agencySummaryStrings[0]);
  //
  // const interval = 15000;
  // let i = 1;
  //
  // // spread the tweets out
  // const tweetInterval = setInterval(() => {
  //   if (i < agencySummaryStrings.length) {
  //     sendTweet(agencySummaryStrings[i]);
  //     i += 1;
  //   } else {
  //     clearInterval(tweetInterval);
  //   }
  // }, interval);
};

module.exports = sendTweets;
