'use strict';

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

exports.handler = async (event, context) => {

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        
        if(event.httpMethod == 'GET'){
            body = await dynamodb.scan({ TableName: "transactions" }).promise();
        }
        
        else {throw new Error(`Unsupported method "${event.httpMethod}"`);}
        
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};
