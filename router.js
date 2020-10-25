'use strict';

const AWS = require("aws-sdk");
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

exports.handler = (event, context, callback) => {
    
    const accountId = context.invokedFunctionArn.split(':')[4];
    const region = context.invokedFunctionArn.split(':')[3];

    var responseCode = 400;
    var responseBody= "Error: Can't process the message.";


    var data = JSON.parse(event.body);
    var hipotekarna = data.message.includes("Hipotekarna");
    var nlb = data.message.includes("NLB");
    console.log("NLB:", nlb);
    console.log("Hipotekarna:", hipotekarna);
    
    if(hipotekarna==true){ 
        
        var params = {
            MessageBody: data.message,
            QueueUrl: "https://sqs." + region + ".amazonaws.com/" + accountId + "/hb_message_processing_queue"
        }
        
        sqs.sendMessage(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
        
        responseBody = "Message sent to hb_message_processing_queue";
        responseCode = 200;
    };
    
    if(nlb==true){ 
        
        var params = {
            MessageBody: data.message,
            QueueUrl: "https://sqs." + region + ".amazonaws.com/" + accountId + "/nlb_message_processing_queue"
        }
        
        sqs.sendMessage(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
        
        responseBody = "Message sent to nlb_message_processing_queue";
        responseCode = 200;
    };
    
    var response = {
        statusCode: responseCode,
        body: responseBody,
    };
    
     callback(null, response);
}