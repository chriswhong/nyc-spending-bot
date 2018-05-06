const toTitleCase = require('./to-title-case');
const numeral = require('numeral');

// add the custom toTitleCase() string method
toTitleCase();
const buildTransactionStrings = transactions => transactions.map((transaction) => {
  // console.log(transaction)

  const {
    agency,
    department,
    check_amount,
    document_id,
    spending_category,
    payee_name,
    contract_purpose,
  } = transaction;

  const purpose = (Object.keys(contract_purpose).length === 0) ? '' : ` (${contract_purpose.toTitleCase()})`;

  const preposition = (Object.keys(document_id).length === 0) ? 'for' : 'to';

  const payee = (Object.keys(document_id).length === 0) ?
    `${spending_category} - ${payee_name.toTitleCase()}` :
    payee_name.toTitleCase();

  return `Yesterday the NYC ${agency.toTitleCase()} (${department.toTitleCase()}) paid ${numeral(check_amount).format('$0,0.00')} ${preposition} ${payee}${purpose}`;
});
