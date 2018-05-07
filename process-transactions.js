const _ = require('underscore');
const numeral = require('numeral');
const moment = require('moment');
const toTitleCase = require('./to-title-case');
const agencyIdLookup = require('./agency-id-lookup.json');

toTitleCase();

const summarizeByAgency = (transactions) => {
  const grouped = _.groupBy(transactions, d => d.agency);
  const mapped = _.mapObject(grouped, val => ({
    count: val.length,
    sum: _.reduce(val, (memo, d) => memo + parseFloat(d.check_amount), 0),
    categories: _.uniq(val, d => d.expense_category).map(d => d.expense_category),
  }));

  return mapped;
};

const stringifyAgencySummaries = (agencySummaries, dateString) => Object.keys(agencySummaries)
  .map((key) => {
    const d = agencySummaries[key];
    const { sum, count, categories } = d;
    const normalizedCategories = categories.map(c => c.toTitleCase());
    const printCategories = normalizedCategories.map(n => `'${n}'`).join(', ');

    const id = agencyIdLookup[key];
    const hyperlink = `https://www.checkbooknyc.com/spending/search/transactions/agency/${id}/chkdate/${dateString}~${dateString}`;

    return `On ${moment(dateString).format('MMMM Do')}, the ${key} had ${count} spending transaction${count > 1 ? 's' : ''} totalling ${numeral(sum).format('$0,0.00')}. Categories included ${printCategories} ${hyperlink}`;
  });

const processTransactions = (transactions, dateString) => {
  // group and map transactions into an array of objects with count, sum, and categories properties
  const agencySummaries = summarizeByAgency(transactions);

  // generate tweet text for each agency
  const agencySummaryStrings = stringifyAgencySummaries(agencySummaries, dateString);

  return agencySummaryStrings;
};

module.exports = processTransactions;
