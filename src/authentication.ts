import passport from 'passport';
import { Strategy } from 'passport-cognito';

export const passportCognito = passport.use(new Strategy({
    userPoolId: 'eu-west-1_6J49lAm0t',
    region: 'eu-west-1',
    clientId: 'oclecdmhg2ahv32bs3od5atb2',
}, (accessToken, idToken, refreshToken, user, callback) => {
    process.nextTick(() => {
        callback(null, user);
    })
}));