'use strict';

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

exports.handler = (event, context, callback) => {
    
  var data = event.Records[0].messageAttributes;
  
  var params={

    Item: {
      uuid: context.awsRequestId,
      card: data.Card.stringValue,
      bank: data.Bank.stringValue,
      amount: data.Amount.stringValue,
      currency: data.Currency.stringValue,
      time: data.Time.stringValue,
      status: data.Status.stringValue,
      description: data.Description.stringValue,
      balance: data.Balance.stringValue,
    },

    TableName: "transactions"
  };

    dynamodb.put(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
};