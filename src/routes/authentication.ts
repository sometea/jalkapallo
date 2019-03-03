import { Request, Response } from 'express';
import express from 'express';
import crypto from 'crypto';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { cognitoConfig } from '../config';
import { container } from '../container';

const cognito = container.CognitoIdentityServiceProvider();
const cognitoExpress = container.CognitoExpress();

export function authenticateWithCognito(req: Request, res: Response, next: () => void) {
    const accessTokenFromClient = req.headers.authorization;
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
        .update(req.body.username + cognitoConfig.clientId)
        .digest('base64');
    cognito.adminInitiateAuth({
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
            USERNAME: req.body.username,
            PASSWORD: req.body.password,
            SECRET_HASH: secretHash,
        },
        ClientId: cognitoConfig.clientId,
        UserPoolId: cognitoConfig.userPoolId,
    }, (err: any, data: any) => {
        if (err) return res.status(401).send({error: err, request: req.body});
        if (!data.AuthenticationResult) {
            return handlePasswordChallenge(data, req, secretHash, res);
        }
        return res.json(data.AuthenticationResult);
    });
});

function handlePasswordChallenge(
    data: CognitoIdentityServiceProvider.AdminInitiateAuthResponse,
    req: Request,
    secretHash: string,
    res: Response
) {
    if (data.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        cognito.adminRespondToAuthChallenge({
            ChallengeName: 'NEW_PASSWORD_REQUIRED',
            ChallengeResponses: {
                NEW_PASSWORD: req.body.password,
                USERNAME: req.body.username,
                SECRET_HASH: secretHash,
            },
            Session: data.Session,
            ClientId: cognitoConfig.clientId,
            UserPoolId: cognitoConfig.userPoolId,
        }, (err: any, data: any) => {
            if (err)
                return res.status(401).send(err);
            return res.json(data.AuthenticationResult);
        });
    }
}
