const request = require('request-promise');
const parser = require('xml2json');

module.exports = (dateString, recordsFrom) => {
  console.log(`Getting Spending for ${dateString} starting at record ${recordsFrom}`)
  const requestXML = `
    <request>
      <type_of_data>Spending</type_of_data>
      <records_from>${recordsFrom}</records_from>
      <max_records>1000</max_records>
      <search_criteria>
        <criteria>
          <name>issue_date</name>
          <type>value</type>
          <value>${dateString}</value>
        </criteria>
      </search_criteria>
    </request>
  `;

  return request.post({
    url: 'https://www.checkbooknyc.com/api/',
    body: requestXML,
    headers: { 'Content-Type': 'text/xml' },
    followAllRedirects: true,
  })
    .then((response) => {
      console.log('Processing XML response...') // eslint-disable-line
      const json = parser.toJson(response, {
        object: true,
      });

      return {
        count: json.response.result_records.record_count,
        transactions: json.response.result_records.spending_transactions.transaction,
      };
    });
};

// link to agency transactions for a date
// https://www.checkbooknyc.com/spending/search/transactions/agency/151/chkdate/2018-05-04~2018-05-04
