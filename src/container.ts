import aws from 'aws-sdk';
import { dynamoDbConfig, cognitoConfig, awsConfig } from './config';
import { ArticleProvider } from './models/articleProvider';
import { ImageProvider } from './models/imageProvider';
import CognitoExpress from 'cognito-express'; 
import { S3Upload } from './models/s3upload';

export const container: any = {
    S3: () => container._s3 || (container._s3 = new aws.S3(awsConfig)),
    S3Upload: () => new S3Upload(container.ImageProvider(), container.S3()),
    DocumentClient: () => container._documentClient || (container._documentClient = new aws.DynamoDB.DocumentClient(dynamoDbConfig)),
    ArticleProvider: () => new ArticleProvider(container.DocumentClient()),
    ImageProvider: () => new ImageProvider(container.DocumentClient()),
    CognitoIdentityServiceProvider: () => new aws.CognitoIdentityServiceProvider(awsConfig),
    CognitoExpress: () => new CognitoExpress({
        region: 'eu-west-1',
        cognitoUserPoolId: cognitoConfig.userPoolId,
        tokenUse: 'access',
        tokenExpiration: 3600000,
    }),
};