import express from 'express';
import { ArticleProvider } from '../models/articleProvider';
import { getDocumentClient } from '../dbConfig';

export const router = express.Router();

const articleProvider = new ArticleProvider(getDocumentClient());

router.get('/', async (req, res) => {
    const articles = await articleProvider.list();
    return res.json(articles);
});

router.get('/:id', async (req, res) => {
    const article = await articleProvider.get(req.params.id);
    return res.json(article);
});