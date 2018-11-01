import CognitoExpress from 'cognito-express'; 
import { Request, Response } from 'express';

const cognitoExpress = new CognitoExpress({
    region: 'eu-west-1',
    cognitoUserPoolId: 'eu-west-1_6J49lAm0t',
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