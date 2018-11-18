import express from 'express';
import { router as authenticationRouter } from './routes/authentication';
import { router as articleRouter } from './routes/articles';
import bodyParser from 'body-parser';

export const app = express().use(bodyParser.json());

app.get('/', (req, res) => {
    return res.send('Hello World.');
});

app.use('/articles', articleRouter);
app.use('/auth', authenticationRouter);
