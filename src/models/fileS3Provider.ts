import path from 'path';
import { S3 } from "aws-sdk/clients/all";
import { S3File } from "./s3file";
import { CrudInterface } from "./crudInterface";
import { jalkapalloConfig } from "../config";

export class FileS3Provider implements CrudInterface<S3File> {
    private contentTypeMapping: any = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.txt': 'text/plain',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };

    constructor(private s3: S3) { }

    async list(): Promise<S3File[]> {
        const result = await this.s3.listObjects({
            Bucket: jalkapalloConfig.s3Bucket,
        }).promise();
        if (!result.Contents) {
            return [];
        }
        return Promise.all(result.Contents.map(async obj => await this.mapS3ObjectToFile(obj)));
    }

    private async mapS3ObjectToFile(object: S3.Object): Promise<S3File> {
        if (!object.Key) {
            throw new Error("Key missing in S3 response.");
        }
        const taggingResult = await this.s3.getObjectTagging({
            Bucket: jalkapalloConfig.s3Bucket,
            Key: object.Key,
        }).promise();
        return new S3File(
            this.findValueForTag('title', taggingResult.TagSet),
            this.findValueForTag('url', taggingResult.TagSet),
            object.Key
        );
    }

    private findValueForTag(tagKey: string, tagSet: S3.Tag[]): string {
        const foundTag = tagSet.find(tag => (tag.Key === tagKey));
        return foundTag !== undefined ? foundTag.Value : '';
    }

    async get(id: string): Promise<S3File> {
        const result = await this.s3.getObjectTagging({
            Bucket: jalkapalloConfig.s3Bucket,
            Key: id,
        }).promise();
        if (!result.TagSet) {
            throw new Error('Failed to get file with id: ' + id);
        }
        return new S3File(
            this.findValueForTag('title', result.TagSet),
            this.findValueForTag('url', result.TagSet),
            id
        );
    }

    async delete(id: string): Promise<void> {
        await this.s3.deleteObject({
            Bucket: jalkapalloConfig.s3Bucket,
            Key: id,
        });
    }

    async create(dataObject: S3File, content: string = ''): Promise<S3File> {
        const result = await this.s3.upload({ 
            Bucket: jalkapalloConfig.s3Bucket,
            Key: dataObject.getId(),
            Body: Buffer.from(content.replace(/^data:.+\/(.+);base64,/, ''), 'base64'),
            ContentType: this.getContentType(dataObject.getId()),
            ACL: 'public-read',
        }).promise();
        await this.s3.putObjectTagging({
            Bucket: jalkapalloConfig.s3Bucket,
            Key: result.Key,
            Tagging: {
                TagSet: [
                    { Key: 'title', Value: dataObject.getTitle() },
                    { Key: 'url', Value: result.Location },
                ],
            },
        }).promise();
        return S3File.copyWithUrl(dataObject, result.Location);
    }

    private getContentType(filename: string) {
        const contentType = this.contentTypeMapping[path.extname(filename)];
        return contentType ? contentType : 'application/octet-stream';
    }

    async update(id: string, dataObject: S3File, content: string = ''): Promise<S3File> {
        const result = await this.s3.upload({ 
            Bucket: jalkapalloConfig.s3Bucket,
            Key: id,
            Body: Buffer.from(content.replace(/^data:.+\/(.+);base64,/, ''), 'base64'),
            ContentType: this.getContentType(id),
            ACL: 'public-read',
        }).promise();
        await this.s3.putObjectTagging({
            Bucket: jalkapalloConfig.s3Bucket,
            Key: result.Key,
            Tagging: {
                TagSet: [
                    { Key: 'title', Value: dataObject.getTitle() },
                    { Key: 'url', Value: result.Location },
                ],
            },
        }).promise();
        return S3File.copyWithUrl(dataObject, result.Location);
    }
}