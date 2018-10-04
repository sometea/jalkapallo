import AWS from 'aws-sdk';
import uuidv4 from 'uuid';

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
        { AttributeName: 'id', AttributeType: 'S' },
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
        saveSampleData();
    }
});

function saveSampleData() {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    const items = [
        { title: 'The badgers are back.', body: 'All the badgers have been seen again.' },
        { title: 'Hellow badgers.', body: 'The badgers are really good people.' },
        { title: 'Tea', body: 'It\'s nice to finally have some tea together.' },
    ];
    for (let item of items) {
        const params = {
            TableName: 'Articles',
            Item: { ...item, id:  uuidv4() },
        };
        documentClient.put(params, (err, data) => {
            if (err) {
                console.log('Unable to add article "' + item.title, '": ' + JSON.stringify(err, null, 2));
            } else {
                console.log('Successfully added article "' + item.title + '"');
            }
        })
    }
}
