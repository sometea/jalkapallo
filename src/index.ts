import express from 'express';
import { router as articleRouter } from './routes/articles';

const app = express();

app.get('/', (req, res) => {
    return res.send('Hello World.');
});

app.use('/articles', articleRouter);

app.listen(3000, () => {
    console.log('Jalkapallo listening on port 3000.');
})
