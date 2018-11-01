import awsServerlessExpress from 'aws-serverless-express';
import { app } from './server';

const server = awsServerlessExpress.createServer(app);

export const handler = (event: any, context: any) => { 
    awsServerlessExpress.proxy(server, event, context);
};