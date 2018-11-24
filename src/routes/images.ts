import { authenticateWithCognito } from './authentication';
import cors from 'cors';
import express from 'express';
import { Image } from '../models/image';
import { container } from '../container';

export const router = express.Router();

router.use(express.json());
router.use(cors({ origin: 'http://localhost:3000', exposedHeaders: 'X-Total-Count' }));
router.use(authenticateWithCognito);

const imageProvider = container.ImageProvider();
const s3upload = container.S3Upload();

router.get('/', async (req, res) => {
    const images = await imageProvider.list();
    return res.header({ 'X-Total-Count': images.length}).json(images);
});

router.get('/:id', async (req, res) => {
    const image = await imageProvider.get(req.params.id);
    return res.json(image);
});

router.post('/', (req, res, next) => s3upload.uploadMiddleware(req, res, next), async (req, res) => {
    const newImage = await imageProvider.create(new Image(
        req.body.title,
        req.body.filename,
        req.body.url,
        ''
    ));
    return res.json(newImage);
});

router.put('/:id', (req, res, next) => s3upload.updateMiddleware(req, res, next), async (req, res) => {
    const updatedImage = await imageProvider.update(
        req.params.id,
        new Image(req.body.title, req.body.filename, req.body.url, '')
    );
    return res.json(updatedImage);
});

router.delete('/:id', (req, res, next) => s3upload.deleteMiddleware(req, res, next), async (req, res) => {
    await imageProvider.delete(req.params.id);
    return res.json({
        message: 'Deleted image ' + req.params.id + '.',
    });
});