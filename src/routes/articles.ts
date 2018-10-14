import express from 'express';
import { ArticleProvider } from '../models/articleProvider';
import { getDocumentClient } from '../dbConfig';
import { Article } from '../models/article';

export const router = express.Router();

router.use(express.json());

const articleProvider = new ArticleProvider(getDocumentClient());

router.get('/', async (req, res) => {
    const articles = await articleProvider.list();
    return res.json(articles);
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