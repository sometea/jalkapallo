import express from 'express';
// import { router as articleRouter } from './routes/articles';
import bodyParser from 'body-parser';
import AWS from 'aws-sdk';
import crypto from 'crypto';

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: 'eu-west-1',
});

const app = express().use(bodyParser.json());

app.get('/', (req, res) => {
    return res.send('Hello World.');
});

app.post('/auth', (req, res) => {
    cognito.adminInitiateAuth({
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
            USERNAME: 'admin',
            PASSWORD: 'AdminAdminAdmin',
            SECRET_HASH: crypto.createHmac('SHA256', 'secret client id').update('admin' + 'oclecdmhg2ahv32bs3od5atb2').digest('base64'),
        },
        ClientId: 'oclecdmhg2ahv32bs3od5atb2',
        UserPoolId: 'eu-west-1_6J49lAm0t',
    }, (err, data) => {
        if (err) return res.status(401).send(err);
        if (!data.AuthenticationResult) return res.status(401).send('No authentication result.');
        return res.json(data.AuthenticationResult);
    });
});

// app.use('/articles', articleRouter);

app.listen(3000, () => {
    console.log('Jalkapallo listening on port 3000.');
})
