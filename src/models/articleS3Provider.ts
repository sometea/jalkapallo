import { CrudInterface } from "./crudInterface";
import { Article } from "./article";
import { S3 } from "aws-sdk/clients/all";
import { jalkapalloConfig } from "../config";
import { ArticleMarkdownMapper } from "./articleMarkdownMapper";
import { TaggingHandler } from "./taggingHandler";

export class ArticleS3Provider implements CrudInterface<Article> {

    constructor(private s3: S3, private mapper: ArticleMarkdownMapper, private taggingHandler: TaggingHandler) { }

    async list(): Promise<Article[]> {
        const result = await this.s3.listObjects({
            Bucket: jalkapalloConfig.articlesBucket,
            Prefix: jalkapalloConfig.articlesDirectory + '/',
        }).promise();
        if (!result.Contents) {
            return [];
        }
        return Promise.all(result.Contents.map(async object => await this.mapS3ObjectToArticle(object)));
    }    

    private async mapS3ObjectToArticle(object: S3.Object): Promise<Article> {
        const taggingResult = await this.s3.getObjectTagging({
            Bucket: jalkapalloConfig.articlesBucket,
            Key: object.Key ? object.Key : '',
        }).promise();
        const title = this.taggingHandler.findValueForTag('title', taggingResult.TagSet);
        const id = object.Key ? this.idFromKey(object.Key) : '';
        return new Article(title, '', id, object.LastModified, 'article');
    }

    async get(id: string): Promise<Article> {
        const result = await this.s3.getObject({
            Bucket: jalkapalloConfig.articlesBucket,
            Key: this.keyFromId(id),
        }).promise();
        if (!result.Body) {
            throw new Error('Failed to get article with id: ' + id);
        }
        return this.mapper.toArticle(result.Body.toString(), id);
    }

    async delete(id: string): Promise<void> {
        await this.s3.deleteObject({
            Bucket: jalkapalloConfig.articlesBucket,
            Key: this.keyFromId(id),
        }).promise();
    }

    private keyFromId(id: string): string {
        return jalkapalloConfig.articlesDirectory + '/' + id + '.md';
    }

    private idFromKey(key: string): string {
        return key.replace(jalkapalloConfig.articlesDirectory + '/', '')
            .replace('.md', '');
    }

    async create(dataObject: Article): Promise<Article> {
        const newArticle = Article.copyWithId(dataObject);
        await this.createOrUpdate(newArticle.getId(), newArticle);
        return newArticle;
    }

    private async createOrUpdate(id: string, dataObject: Article): Promise<void> {
        await this.s3.upload({
            Bucket: jalkapalloConfig.articlesBucket,
            Key: this.keyFromId(id),
            Body: this.mapper.toMarkdown(dataObject),
            ContentType: 'text/plain',
            Tagging: 'title=' + dataObject.getTitle(),
            ACL: 'public-read',
        }).promise();
    }
    
    async update(id: string, dataObject: Article): Promise<Article> {
        await this.createOrUpdate(id, dataObject);
        return dataObject;
    }

}