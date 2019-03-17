import S3 from 'aws-sdk/clients/s3';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { dynamoDbConfig, cognitoConfig, awsConfig } from './config';
import { ArticleProvider } from './models/articleProvider';
import CognitoExpress from 'cognito-express'; 
import { ArticleExport } from './models/articleExport';
import { ArticleS3Provider } from './models/articleS3Provider';
import { ArticleMarkdownMapper } from './models/articleMarkdownMapper';
import { FileS3Provider } from './models/fileS3Provider';
import { TaggingHandler } from './models/taggingHandler';

export const container = {
    _s3: new S3(awsConfig),
    _documentClient: new DocumentClient(dynamoDbConfig),
    _dynamodDb: new DynamoDB(dynamoDbConfig),
    S3: () => container._s3,
    DocumentClient: () => container._documentClient,
    DynamoDB: () => container._dynamodDb,
    ArticleProvider: () => new ArticleProvider(container.DocumentClient()),
    ArticleS3Provider: () => new ArticleS3Provider(container.S3(), container.ArticleMarkdownMapper(), container.TaggingHandler()),
    FileS3Provider: () => new FileS3Provider(container.S3(), container.TaggingHandler()),
    ArticleMarkdownMapper: () => new ArticleMarkdownMapper(),
    TaggingHandler: () => new TaggingHandler(),
    ArticleExport: () => new ArticleExport(container.S3()),
    CognitoIdentityServiceProvider: () => new CognitoIdentityServiceProvider(awsConfig),
    CognitoExpress: () => new CognitoExpress({
        region: 'eu-west-1',
        cognitoUserPoolId: cognitoConfig.userPoolId,
        tokenUse: 'access',
        tokenExpiration: 3600000,
    }),
};