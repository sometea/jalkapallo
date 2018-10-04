import AWS from 'aws-sdk';

AWS.config.update({
    region: "eu-west-1",
    endpoint: "http://localhost:8000",
}, true);

const dynamoDb = new AWS.DynamoDB();

dynamoDb.createTable({
    TableName: 'Articles',
    KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
        { AttributeName: 'title', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'N' },
        { AttributeName: 'title', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
    },
}, (err, data) => {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
