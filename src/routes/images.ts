import { authenticateWithCognito } from './authentication';
import express from 'express';
import { container } from '../container';
import { S3File } from '../models/s3file';

export const router = express.Router();

router.use(express.json());
router.use(authenticateWithCognito);

const imageProvider = container.FileS3Provider();

router.get('/', async (req, res) => {
    const images = await imageProvider.list();
    return res.header({ 'X-Total-Count': images.length}).json(images);
});

router.get('/:id', async (req, res) => {
    const image = await imageProvider.get(req.params.id);
    return res.json(image);
});

router.post('/', async (req, res) => {
    const newImage = await imageProvider.create(new S3File(
        req.body.title,
        '',
        req.body.filename
    ).setBase64Content(req.body.body));
    return res.json(newImage);
});

router.put('/:id', async (req, res) => {
    const s3File = new S3File(req.body.title, '', req.body.filename);
    if (req.body.body) {
        s3File.setBase64Content(req.body.body);
    }
    const updatedImage = await imageProvider.update(
        req.params.id,
        s3File
    );
    return res.json(updatedImage);
});

router.delete('/:id', async (req, res) => {
    await imageProvider.delete(req.params.id);
    return res.json({
        message: 'Deleted image.',
        id: req.params.id,
    });
});