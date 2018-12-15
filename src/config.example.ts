export const jalkapalloConfig = {
    port: 3001,
    allowCORFrom: 'http://localhost:3000',
    maxUploadSize: '10mb',
    s3Bucket: 'jalkapallo-images-bucket',
    exportBucket: 'jalkapallo-export',
    shouldExport: false,
    articlesTable: 'JalkapalloArticles',
    imagesTable: 'JalkapalloImages',
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