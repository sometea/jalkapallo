import express from 'express';
import { ArticleProvider } from '../models/articleProvider';
import { getDocumentClient } from '../dbConfig';

export const router = express.Router();

const articleProvider = new ArticleProvider(getDocumentClient());

router.get('/', async (req, res) => {
    const articles = await articleProvider.list();
    return res.json(articles);
});