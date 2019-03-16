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
            Bucket: jalkapalloConfig.filesBucket,
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
            Bucket: jalkapalloConfig.filesBucket,
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
            Bucket: jalkapalloConfig.filesBucket,
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
            Bucket: jalkapalloConfig.filesBucket,
            Key: id,
        }).promise();
    }

    async create(dataObject: S3File): Promise<S3File> {
        return await this.update(dataObject.getId(), dataObject);
    }

    private getContentType(filename: string) {
        const contentType = this.contentTypeMapping[path.extname(filename)];
        return contentType ? contentType : 'application/octet-stream';
    }

    async update(id: string, dataObject: S3File): Promise<S3File> {
        const location = await this.updateOrRetrieveObject(dataObject, id);
        await this.s3.putObjectTagging({
            Bucket: jalkapalloConfig.filesBucket,
            Key: id,
            Tagging: {
                TagSet: [
                    { Key: 'title', Value: dataObject.getTitle() },
                    { Key: 'url', Value: location },
                ],
            },
        }).promise();
        return S3File.copyWithUrl(dataObject, location);
    }

    private async updateOrRetrieveObject(dataObject: S3File, id: string) {
        if (dataObject.hasContent()) {
            const result = await this.s3.upload({
                Bucket: jalkapalloConfig.filesBucket,
                Key: id,
                Body: dataObject.getContent(),
                ContentType: this.getContentType(id),
                ACL: 'public-read',
            }).promise();
            return result.Location;
        }
        const objectOnS3 = await this.get(id);
        return objectOnS3.getUrl();
    }
}