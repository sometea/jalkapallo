import express from 'express';
import { ArticleProvider } from '../models/articleProvider';
import { getDocumentClient } from '../dbConfig';
import { Article } from '../models/article';
import { authenticateWithCognito } from '../authentication';
import cors from 'cors';

export const router = express.Router();

router.use(express.json());
router.use(cors({ origin: 'http://localhost:3000', exposedHeaders: 'X-Total-Count' }));
router.use(authenticateWithCognito);

const articleProvider = new ArticleProvider(getDocumentClient());

router.get('/', async (req, res) => {
    const articles = await articleProvider.list();
    return res.header({ 'X-Total-Count': articles.length}).json(articles);
});

router.get('/:id', async (req, res) => {
    const article = await articleProvider.get(req.params.id);
    return res.json(article);
});

router.post('/', async (req, res) => {
    const postBody = req.body;
    const newArticle = await articleProvider.save(new Article(
        postBody.title,
        postBody.body,
        ''
    ));
    return res.json(newArticle);
});

router.delete('/:id', async (req, res) => {
    await articleProvider.delete(req.params.id);
    return res.json({
        message: 'Deleted article ' + req.params.id + '.',
    });
});