import aws, { S3 } from 'aws-sdk';
import { ExportInterface } from "./exportInterface";
import { Article } from "./article";
import { jalkapalloConfig } from '../config';

export class ArticleExport implements ExportInterface<Article> {
    constructor(private s3: aws.S3) {}

    private getFilename(id: string): string {
        return id + '.md';
    }

    private getFileContent(dataObject: Article) {
        return `---
title: ${dataObject.getTitle()}
---
${dataObject.getBody()}`;
    }

    async delete(id: string): Promise<void> {
        await this.s3.deleteObject({
            Bucket: jalkapalloConfig.exportBucket,
            Key: this.getFilename(id),
        }).promise();
    }

    async createOrUpdate(dataObject: Article): Promise<Article> {
        await this.s3.upload({
            Bucket: jalkapalloConfig.s3Bucket,
            Key: this.getFilename(dataObject.getId()),
            Body: Buffer.from(this.getFileContent(dataObject)),
            ContentType: 'text/plain',
            ACL: 'public-read',
        }).promise();
        return dataObject;
    }
}