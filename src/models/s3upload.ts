import aws from 'aws-sdk';
import path from 'path';
import { Request, Response } from 'express';
import { ImageProvider } from './imageProvider';

export class S3Upload {
    private contentTypeMapping: any = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };

    constructor(private imageProvider: ImageProvider, private s3: aws.S3) {
    }

    getKey(filename: string) {
        return Date.now().toString() + '.' + filename;
    }

    getContentType(filename: string) {
        const contentType = this.contentTypeMapping[path.extname(filename)];
        return contentType ? contentType : 'application/octet-stream';
    }

    async uploadMiddleware(req: Request, res: Response, next: () => void) {
        const result = await this.upload(req.body.filename, req.body.body);
        req.body.filename = result.Key;
        req.body.url = result.Location;
        return next();
    }

    async updateMiddleware(req: Request, res: Response, next: () => void) {
        if (req.body.filename && req.body.body) {
            const image = await this.imageProvider.get(req.params.id);
            await this.delete(image.getFilename());
            const result = await this.upload(req.body.filename, req.body.body);
            req.body.filename = result.Key;
            req.body.url = result.Location;
        }
        return next();
    }

    async deleteMiddleware(req: Request, res: Response, next: () => void) {
        const image = await this.imageProvider.get(req.params.id);
        await this.delete(image.getFilename());
        return next();
    }

    private async upload(filename: string, body: string) {
        const uploadParams = { 
            Bucket: 'jalkapallo-images',
            Key: this.getKey(filename),
            Body: Buffer.from(body),
            ContentType: this.getContentType(filename), 
            ACL: 'public-read',
        };
        return await this.s3.upload(uploadParams).promise();
    }

    private async delete(key: string) {
        await this.s3.deleteObject({
            Bucket: 'jalkapallo-images',
            Key: key,
        }).promise();
    }
}