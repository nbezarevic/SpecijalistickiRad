'use strict';

const AWS = require("aws-sdk");
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

exports.handler = (event, context, callback) => {

    const accountId = context.invokedFunctionArn.split(':')[4];
    const region = context.invokedFunctionArn.split(':')[3];

    var data = event.Records[0].body;
    var poruka = data.split('\n');
    
    var kartica = poruka[0].split(':');
    var banka = poruka[1].split(':');
    var iznos = poruka[2].split(' ');
    var vrijeme = poruka[3].split(' ');
    var stat = poruka[4].split(':');
    var opis = poruka[5].split(':');
    var raspolozivo = poruka[6].split(' ');
    
    var card = kartica[1];
    var bank = banka[1];
    var amount = iznos[1];
    var currency = iznos[2];
    var time = vrijeme[1] + " " + vrijeme[2];
    var status = stat[1];
    var description = opis[1];
    var balance = raspolozivo[1];

    var params = {
        MessageBody: event.Records[0].body,
        QueueUrl: "https://sqs." + region + ".amazonaws.com/" + accountId + "/parsed_messages",
        MessageAttributes: {
            "Card": {
                DataType: "String",
                StringValue: card.trim()
                    },
            "Bank": {
                DataType: "String",
                StringValue: bank.trim()
                    },
            "Amount": {
                DataType: "String",
                StringValue: amount.trim()
                    },
            "Currency": {
                DataType: "String",
                StringValue: currency.trim()
                    },
            "Time": {
                DataType: "String",
                StringValue: time.trim()
                    },
            "Status": {
                DataType: "String",
                StringValue: status.trim()
                    },
            "Description": {
                DataType: "String",
                StringValue: description.trim()
                    },
            "Balance": {
                DataType: "String",
                StringValue: balance.trim()
                    }        
        },
    };

    sqs.sendMessage(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
    
};