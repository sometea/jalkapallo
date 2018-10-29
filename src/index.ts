import express from 'express';
import { router as articleRouter } from './routes/articles';
import { passportCognito } from './authentication';
import bodyParser from 'body-parser';

const app = express();

app.get('/', (req, res) => {
    return res.send('Hello World.');
});

app.use(bodyParser.json());
app.use(passportCognito.initialize());

app.use('/articles', articleRouter);

app.post('/authenticate', passportCognito.authenticate('cognito', {
    successMessage: 'success',
    failureMessage: 'failure',
}));


app.listen(3000, () => {
    console.log('Jalkapallo listening on port 3000.');
})
