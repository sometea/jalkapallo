import express from 'express';
import { Article } from '../models/article';
import { authenticateWithCognito } from './authentication';
import { container } from '../container';
import { jalkapalloConfig } from '../config';

export const router = express.Router();

router.use(express.json());
router.use(authenticateWithCognito);

const articleProvider = container.ArticleProvider();
const articleExport = container.ArticleExport();

router.get('/', async (req, res) => {
    const articles = await articleProvider.list();
    return res.header({ 'X-Total-Count': articles.length}).json(articles);
});

router.get('/:id', async (req, res) => {
    try {
        const article = await articleProvider.get(req.params.id);
        return res.json(article);
    } catch (e) {
        return res.status(404).json(e);
    }
});

router.post('/', async (req, res) => {
    const newArticle = await articleProvider.create(new Article(
        req.body.title,
        req.body.body,
        ''
    ));
    try {
        await processUpdateHooks(newArticle);
    } catch (e) {
        return res.status(500).json(e);
    }
    return res.json(newArticle);
});

router.put('/:id', async (req, res) => {
    const updatedArticle = await articleProvider.update(
        req.params.id,
        new Article(req.body.title, req.body.body, '')
    );
    try {
        await processUpdateHooks(updatedArticle);
    } catch (e) {
        return res.status(500).json(e);
    }
    return res.json(updatedArticle);
});

router.delete('/:id', async (req, res) => {
    await articleProvider.delete(req.params.id);
    try {
        await processDeleteHooks(req.params.id);
    } catch (e) {
        return res.status(500).json(e);
    }
    return res.json({
        message: 'Deleted article.',
        id: req.params.id,
    });
});

async function processUpdateHooks(article: Article) {
    if (jalkapalloConfig.shouldExport) {
        await articleExport.createOrUpdate(article);
    }
}

async function processDeleteHooks(id: string) {
    if (jalkapalloConfig.shouldExport) {
        await articleExport.delete(id);
    }
}