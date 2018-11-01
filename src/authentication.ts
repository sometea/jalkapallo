import CognitoExpress from 'cognito-express'; 
import { Request, Response } from 'express';
import express from 'express';
import crypto from 'crypto';
import AWS from 'aws-sdk';
import { cognitoConfig } from './cognitoConfig';

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: 'eu-west-1',
});

const cognitoExpress = new CognitoExpress({
    region: 'eu-west-1',
    cognitoUserPoolId: cognitoConfig.userPoolId,
    tokenUse: 'access',
    tokenExpiration: 3600000,
});

export function authenticateWithCognito(req: Request, res: Response, next: () => void) {
    const accessTokenFromClient = req.headers.accesstoken;
    if (!accessTokenFromClient) return res.status(401).send("Access Token missing from header");
 
    cognitoExpress.validate(accessTokenFromClient, (err: any, response: any) => {
        if (err) return res.status(401).send(err);
        res.locals.user = response;
        next();
    });
}

export const router = express.Router();

router.use(express.json());

router.post('/', (req, res) => {
    const secretHash = crypto
        .createHmac('SHA256', cognitoConfig.clientSecret)
        .update('admin' + cognitoConfig.clientId)
        .digest('base64');
    cognito.adminInitiateAuth({
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
            USERNAME: 'admin',
            PASSWORD: 'AdminAdminAdmin',
            SECRET_HASH: secretHash,
        },
        ClientId: cognitoConfig.clientId,
        UserPoolId: cognitoConfig.userPoolId,
    }, (err, data) => {
        if (err) return res.status(401).send(err);
        if (!data.AuthenticationResult) {
            if (data.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
                cognito.adminRespondToAuthChallenge({
                    ChallengeName: 'NEW_PASSWORD_REQUIRED',
                    ChallengeResponses: {
                        NEW_PASSWORD: 'AdminAdminAdmin',
                        USERNAME: 'admin',
                        SECRET_HASH: secretHash,
                    },
                    Session: data.Session,
                    ClientId: cognitoConfig.clientId,
                    UserPoolId: cognitoConfig.userPoolId,

                }, (err, data) => {
                    if (err) return res.status(401).send(err);
                    return res.json(data.AuthenticationResult);
                })
            }
        }
        return res.json(data.AuthenticationResult);
    });
});