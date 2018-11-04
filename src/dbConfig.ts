import AWS from 'aws-sdk';
import { dynamoDbConfig } from './config';

export function getDocumentClient() {
    AWS.config.update(dynamoDbConfig, true);    
    return new AWS.DynamoDB.DocumentClient();
}