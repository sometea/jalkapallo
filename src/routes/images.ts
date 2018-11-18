import { authenticateWithCognito } from './authentication';
import cors from 'cors';
import express from 'express';
import { ImageProvider } from '../models/imageProvider';
import { getDocumentClient } from '../dbConfig';
import { Image } from '../models/image';

export const router = express.Router();

router.use(express.json());
router.use(cors({ origin: 'http://localhost:3000', exposedHeaders: 'X-Total-Count' }));
router.use(authenticateWithCognito);

const imageProvider = new ImageProvider(getDocumentClient());

router.get('/', async (req, res) => {
    const images = await imageProvider.list();
    return res.header({ 'X-Total-Count': images.length}).json(images);
});

router.get('/:id', async (req, res) => {
    const image = await imageProvider.get(req.params.id);
    return res.json(image);
});

router.post('/', async (req, res) => {
    const newImage = await imageProvider.create(new Image(
        req.body.title,
        req.body.filename,
        req.body.url,
        ''
    ));
    return res.json(newImage);
});

router.put('/:id', async (req, res) => {
    const updatedImage = await imageProvider.update(
        req.params.id,
        new Image(req.body.title, req.body.filename, req.body.url, '')
    );
    return res.json(updatedImage);
});

router.delete('/:id', async (req, res) => {
    await imageProvider.delete(req.params.id);
    return res.json({
        message: 'Deleted image ' + req.params.id + '.',
    });
});