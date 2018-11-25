import express from 'express';
import { router as authenticationRouter } from './routes/authentication';
import { router as articleRouter } from './routes/articles';
import { router as imagesRouter } from './routes/images';
import cors from 'cors';
import bodyParser from 'body-parser';
import { jalkapalloConfig } from './config';

export const app = express();
app.use(bodyParser.json({ limit: jalkapalloConfig.maxUploadSize }));
app.use(cors({ origin: jalkapalloConfig.allowCORFrom, exposedHeaders: 'X-Total-Count' }));

app.get('/', (req, res) => {
    return res.send('Hello World.');
});

app.use('/articles', articleRouter);
app.use('/images', imagesRouter);
app.use('/auth', authenticationRouter);
