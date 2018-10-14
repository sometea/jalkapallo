import AWS from 'aws-sdk';

export function getDocumentClient() {
    AWS.config.update({
        region: "eu-west-1",
        endpoint: "http://localhost:8000",
    }, true);    
    return new AWS.DynamoDB.DocumentClient();
}