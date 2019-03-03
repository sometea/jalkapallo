import S3 from 'aws-sdk/clients/s3';
import { ExportInterface } from "./exportInterface";
import { Article } from "./article";
import { jalkapalloConfig } from '../config';

export class ArticleExport implements ExportInterface<Article> {
    constructor(private s3: S3) {}

    private getKey(id: string): string {
        return jalkapalloConfig.exportDirectory + '/' + id + '.md';
    }

    private getFileContent(dataObject: Article) {
        return `---${this.getHeaderFromMetaData(dataObject.getMetaData())}
title: ${dataObject.getTitle()}
date: ${dataObject.getDate().toDateString()}
---
${dataObject.getBody()}`;
    }

    private getHeaderFromMetaData(metaData: {[key: string]: string}) {
        return Object.keys(metaData).reduce((previous, current) => previous + "\n" + current + ": " + metaData[current], '');
    }

    async delete(id: string): Promise<void> {
        await this.s3.deleteObject({
            Bucket: jalkapalloConfig.exportBucket,
            Key: this.getKey(id),
        }).promise();
    }

    async createOrUpdate(dataObject: Article): Promise<Article> {
        await this.s3.upload({
            Bucket: jalkapalloConfig.exportBucket,
            Key: this.getKey(dataObject.getId()),
            Body: Buffer.from(this.getFileContent(dataObject)),
            ContentType: 'text/plain',
            ACL: 'public-read',
        }).promise();
        return dataObject;
    }
}