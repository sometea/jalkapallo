import { CrudInterface } from "./crudInterface";
import { Article } from "./article";
import { S3 } from "aws-sdk/clients/all";
import { jalkapalloConfig } from "../config";
import { ArticleMarkdownMapper } from "./articleMarkdownMapper";

export class ArticleS3Provider implements CrudInterface<Article> {

    constructor(private s3: S3, private mapper: ArticleMarkdownMapper) { }

    async list(): Promise<Article[]> {
        const result = await this.s3.listObjects({
            Bucket: jalkapalloConfig.exportBucket,
            Prefix: jalkapalloConfig.exportDirectory + '/',
        }).promise();
        if (!result.Contents) {
            return [];
        }
        return result.Contents.map(object => this.mapS3ObjectToArticle(object));
    }    

    private mapS3ObjectToArticle(object: S3.Object): Article {
        const key = object.Key ? object.Key : '';
        return new Article(key, '', key, object.LastModified, 'article');
    }

    async get(id: string): Promise<Article> {
        const result = await this.s3.getObject({
            Bucket: jalkapalloConfig.exportBucket,
            Key: this.makeKey(id),
        }).promise();
        if (!result.Body) {
            throw new Error('Failed to get article with id: ' + id);
        }
        return this.mapper.toArticle(result.Body.toString(), id);
    }

    async delete(id: string): Promise<void> {
        await this.s3.deleteObject({
            Bucket: jalkapalloConfig.exportBucket,
            Key: this.makeKey(id),
        }).promise();
    }

    private makeKey(id: string): string {
        return jalkapalloConfig.exportDirectory + '/' + id + '.md';
    }

    async create(dataObject: Article): Promise<Article> {
        const newArticle = Article.copyWithId(dataObject);
        await this.createOrUpdate(newArticle.getId(), newArticle);
        return newArticle;
    }

    private async createOrUpdate(id: string, dataObject: Article): Promise<void> {
        await this.s3.upload({
            Bucket: jalkapalloConfig.exportBucket,
            Key: this.makeKey(id),
            Body: this.mapper.toMarkdown(dataObject),
            ContentType: 'text/plain',
            ACL: 'public-read',
        }).promise();
    }
    
    async update(id: string, dataObject: Article): Promise<Article> {
        await this.createOrUpdate(id, dataObject);
        return dataObject;
    }

}