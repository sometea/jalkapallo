import express from 'express';
import { router as authenticationRouter } from './authentication';
import { router as articleRouter } from './routes/articles';
import bodyParser from 'body-parser';

const app = express().use(bodyParser.json());

app.get('/', (req, res) => {
    return res.send('Hello World.');
});

app.use('/articles', articleRouter);
app.use('/auth', authenticationRouter);

app.listen(3000, () => {
    console.log('Jalkapallo listening on port 3000.');
})
