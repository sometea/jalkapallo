export const jalkapalloConfig = {
    port: 3001,
    allowCORFrom: 'http://localhost:3000',
    maxUploadSize: '10mb',
    filesBucket: 'jalkapallo-images-bucket',
    articlesBucket: 'jalkapallo-export',
    articlesDirectory: 'content',
    articlesTable: 'JalkapalloArticles',
};

export const cognitoConfig = {
    userPoolId: 'userPoolId',
    clientId: 'clientId',
    clientSecret: 'clientSecret',
};

export const dynamoDbConfig = {
    region: "eu-west-1",
    endpoint: "http://localhost:8000",
};

export const awsConfig = {
    region: "eu-west-1",
};